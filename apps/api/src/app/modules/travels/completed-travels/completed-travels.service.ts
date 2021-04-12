import { IQueryParams, IQueryResults } from '@bits404/api-interfaces';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { forkJoin } from 'rxjs';
import { HttpOptions } from '../../../core/interfaces';
import { CreateCompletedTravelDto } from './dto/create-completed-travel.dto';
import { UpdateCompletedTravelDto } from './dto/update-completed-travel.dto';
import { CompletedTravel, CompletedTravelDocument } from './schemas/completed-travel.schema';

@Injectable()
export class CompletedTravelsService {

  constructor(
    @InjectModel(CompletedTravel.name) private readonly completedTravelModel: Model<CompletedTravelDocument>
  ) { }

  create(createCompletedTravelDto: CreateCompletedTravelDto, options: HttpOptions): Promise<CompletedTravelDocument> {
    return new this.completedTravelModel({
      ...createCompletedTravelDto,
      company: options.company,
    }).save({ session: options.session });
  }

  findAll(queryParams: IQueryParams, options: HttpOptions): Promise<IQueryResults> {
    const limit = Number(queryParams.pageSize);
    const skip = Number(queryParams.pageNumber * queryParams.pageSize);

    const baseQuery = this.completedTravelModel.find({ company: options.company }).session(options.session);
    const query = this.completedTravelModel
      .find()
      .merge(baseQuery)
      .sort({ [queryParams.sortField]: queryParams.sortOrder })
      .limit(limit)
      .skip(skip);
    const countQuery = this.completedTravelModel.find().merge(baseQuery).count();

    return forkJoin({
      items: query.exec(),
      totalCount: countQuery.exec(),
    }).toPromise();
  }

  findOne(_id: string, options: HttpOptions): Promise<CompletedTravelDocument> {
    return this.completedTravelModel.findOne({ _id, company: options.company }).session(options.session).exec();
  }

  update(_id: string, updateTravelDto: UpdateCompletedTravelDto, options: HttpOptions): Promise<CompletedTravelDocument> {
    return this.completedTravelModel.findOneAndUpdate({ _id, company: options.company }, { $set: updateTravelDto }, { new: true, session: options.session }).exec();
  }

  remove(_id: string, options: HttpOptions): Promise<CompletedTravelDocument> {
    return this.completedTravelModel.findOneAndRemove({ _id, company: options.company }, { session: options.session }).exec();
  }
}
