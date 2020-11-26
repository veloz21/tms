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
    const limit = queryParams.pageSize;
    const skip = queryParams.pageNumber * queryParams.pageSize;
    const query = this.travelModel.find({ company: options.company }).sort({ [queryParams.sortField]: queryParams.sortOrder }).session(options.session);
    return forkJoin({
      items: query.limit(limit).skip(skip).exec(),
      totalCount: query.count().exec(),
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
