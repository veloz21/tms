import { IQueryParams, IQueryResults } from '@bits404/api-interfaces';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { forkJoin } from 'rxjs';
import type { HttpOptions } from '../../core/interfaces';
import { CreateTravelDto } from './dto/create-travel.dto';
import { UpdateTravelDto } from './dto/update-travel.dto';
import { Travel, TravelDocument } from './schemas/travel.schema';

@Injectable()
export class TravelsService {

  constructor(
    @InjectModel(Travel.name) private readonly travelModel: Model<TravelDocument>,
  ) { }

  create(createTravelDto: CreateTravelDto, options: HttpOptions): Promise<TravelDocument> {
    return new this.travelModel({
      ...createTravelDto,
      company: options.company,
    }).save({ session: options.session });
  }

  findAll(queryParams: IQueryParams, options: HttpOptions): Promise<IQueryResults> {
    const limit = Number(queryParams.pageSize);
    const skip = Number(queryParams.pageNumber * queryParams.pageSize);

    const baseQuery = this.travelModel.find({ company: options.company }).session(options.session);
    const query = this.travelModel.find().merge(baseQuery).sort({ [queryParams.sortField]: queryParams.sortOrder }).limit(limit).skip(skip);
    const countQuery = this.travelModel.find().merge(baseQuery).count();

    return forkJoin({
      items: query.exec(),
      totalCount: countQuery.exec(),
    }).toPromise();
  }

  findOne(_id: string, options: HttpOptions): Promise<TravelDocument> {
    return this.travelModel.findOne({ _id, company: options.company }).session(options.session).exec();
  }

  update(_id: string, updateTravelDto: UpdateTravelDto, options: HttpOptions): Promise<TravelDocument> {
    return this.travelModel.findOneAndUpdate({ _id, company: options.company }, { $set: updateTravelDto }, { new: true, session: options.session }).exec();
  }

  remove(_id: string, options: HttpOptions): Promise<TravelDocument> {
    return this.travelModel.findOneAndRemove({ _id, company: options.company }, { session: options.session, }).exec();
  }
}
