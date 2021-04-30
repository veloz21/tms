import { IQueryParams, IQueryResults } from '@bits404/api-interfaces';
import { Injectable, UseInterceptors } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { plainToClass } from 'class-transformer';
import * as mongoose from 'mongoose';
import { Model } from 'mongoose';
import { forkJoin } from 'rxjs';
import { TransformInterceptor } from '../../core/interceptors/transform.interceptor';
import type { HttpOptions } from '../../core/interfaces';
import { stringToMongoId } from '../../core/utils';
import { CreateTravelDto } from './dto/create-travel.dto';
import { TravelDto } from './dto/travel.dto';
import { UpdateTravelStatusDto } from './dto/update-travel-status.dto';
import { UpdateTravelDto } from './dto/update-travel.dto';
import { Expense, ExpenseDocument } from './expenses/schemas/expenses.schema';
import { TravelStatus, TravelStatusDocument } from './schemas/travel-status.schema';
import { Travel, TravelDocument } from './schemas/travel.schema';

@Injectable()
export class TravelsService {
  constructor(
    @InjectModel(Travel.name) private readonly travelModel: Model<TravelDocument>,
    @InjectModel(Expense.name) private readonly expenseModel: Model<ExpenseDocument>,
    @InjectModel(TravelStatus.name) private readonly travelStatusModel: Model<TravelStatusDocument>
  ) {}

  create(createTravelDto: CreateTravelDto, options: HttpOptions): Promise<TravelDocument> {
    const travelModel = new this.travelModel(createTravelDto);
    travelModel.expenses =
      createTravelDto.expenses?.map(
        (e) =>
          new this.expenseModel({
            price: e.price,
            name: e.name,
          })
      ) || [];
    travelModel.company = options.company;
    return travelModel.save({ session: options.session });
  }

  findAll(queryParams: IQueryParams, options: HttpOptions): Promise<IQueryResults> {
    const limit = Number(queryParams.pageSize);
    const skip = Number(queryParams.pageNumber * queryParams.pageSize);

    let status: string[] = queryParams.filter.status as string[];
    const statusArray = status.map((s) => stringToMongoId(s));
    const baseQuery = this.travelModel.find({ $and: [{ company: options.company }, { currentStatus: { $in: statusArray } }] }).session(options.session);
    const query = this.travelModel
      .find()
      .merge(baseQuery)
      .sort({ [queryParams.sortField]: queryParams.sortOrder })
      .limit(limit)
      .skip(skip);
    const countQuery = this.travelModel.find().merge(baseQuery).count();

    return forkJoin({
      items: query.exec(),
      totalCount: countQuery.exec(),
    }).toPromise();
  }

  @UseInterceptors(new TransformInterceptor(TravelDto))
  findOne(_id: mongoose.Types.ObjectId, options: HttpOptions): Promise<TravelDocument> {
    return this.travelModel.findOne({ _id, company: options.company }).session(options.session).exec();
  }

  findOneStatus(_id: mongoose.Types.ObjectId, options: HttpOptions): Promise<TravelStatusDocument> {
    return this.travelStatusModel.findOne({ _id, company: options.company }).session(options.session).exec();
  }

  update(_id: mongoose.Types.ObjectId, updateTravelDto: UpdateTravelDto, options: HttpOptions): Promise<TravelDocument> {
    return this.travelModel.findOneAndUpdate({ _id, company: options.company }, { $set: updateTravelDto }, { new: true, session: options.session }).exec();
  }

  async updateTravelStatus(_id: mongoose.Types.ObjectId, updateTravelStatusDto: UpdateTravelStatusDto, options: HttpOptions): Promise<TravelDocument> {
    const travel = await this.findOne(_id, options);
    const travelDto = plainToClass(TravelDto, travel, { enableImplicitConversion: true });

    const newStatusId = updateTravelStatusDto.id;
    const statusIndex = travelDto.status.findIndex((s) => s._id == newStatusId.toString());
    travel.status[statusIndex].date = updateTravelStatusDto.date;
    travel.status[statusIndex].comments = updateTravelStatusDto.comments;
    travel.currentStatus = newStatusId;

    return this.travelModel.findOneAndUpdate({ _id, company: options.company }, { $set: travel }, { new: true, session: options.session }).exec();
  }

  remove(_id: mongoose.Types.ObjectId, options: HttpOptions): Promise<TravelDocument> {
    return this.travelModel.findOneAndRemove({ _id, company: options.company }, { session: options.session }).exec();
  }

  updateCurrentStatus(_id: mongoose.Types.ObjectId, statusId: mongoose.Types.ObjectId, options: HttpOptions): Promise<TravelDocument> {
    return this.travelModel.findOneAndUpdate({ _id, company: options.company }, { $set: { currentStatus: statusId } }, { new: true, session: options.session }).exec();
  }

  getTravelStatus(options: HttpOptions) {
    return this.travelStatusModel.find({ company: options.company }).select('name').session(options.session);
  }
}
