import { IQueryParams, IQueryResults } from '@bits404/api-interfaces';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Model } from 'mongoose';
import { forkJoin } from 'rxjs';
import type { HttpOptions } from '../../../core/interfaces';
import { TravelStatusDto } from '../../travels/dto/travel-status.dto';
import { CreateTruckDto } from './dto/create-truck.dto';
import { UpdateTruckDto } from './dto/update-truck.dto';
import { Truck, TruckDocument } from './schemas/truck.schema';

@Injectable()
export class TrucksService {

  constructor(
    @InjectModel(Truck.name) private readonly truckModel: Model<TruckDocument>,
  ) { }

  create(createTruckDto: CreateTruckDto, options: HttpOptions): Promise<TruckDocument> {
    return new this.truckModel({
      ...createTruckDto,
      company: options.company,
    }).save({ session: options.session });
  }

  findAll(queryParams: IQueryParams, options: HttpOptions): Promise<IQueryResults> {
    const limit = Number(queryParams.pageSize);
    const skip = Number(queryParams.pageNumber * queryParams.pageSize);

    const baseQuery = this.truckModel.find({ company: options.company }).session(options.session);
    const query = this.truckModel.find().merge(baseQuery).sort({ [queryParams.sortField]: queryParams.sortOrder }).limit(limit).skip(skip);
    const countQuery = this.truckModel.find().merge(baseQuery).count();

    return forkJoin({
      items: query.exec(),
      totalCount: countQuery.exec(),
    }).toPromise();
  }

  findOne(_id: mongoose.Types.ObjectId, options: HttpOptions): Promise<TruckDocument> {
    return this.truckModel.findOne({ _id, company: options.company }).session(options.session).exec();
  }

  update(_id: mongoose.Types.ObjectId, updateTruckDto: UpdateTruckDto, options: HttpOptions): Promise<TruckDocument> {
    return this.truckModel.findOneAndUpdate({ _id, company: options.company }, { $set: updateTruckDto }, { new: true, session: options.session }).exec();
  }

  remove(_id: mongoose.Types.ObjectId, options: HttpOptions): Promise<TruckDocument> {
    return this.truckModel.findOneAndRemove({ _id, company: options.company }, { session: options.session, }).exec();
  }

  updateStatusByTravelStatus(_id: mongoose.Types.ObjectId, travelStatus: TravelStatusDto, options: HttpOptions): Promise<TruckDocument> {
    if (travelStatus && travelStatus.relatedStatus && travelStatus.relatedStatus.truck !== undefined) {
      return this.truckModel.findOneAndUpdate({ _id, company: options.company }, { $set: { "status": travelStatus.relatedStatus.truck } }, { session: options.session }).exec();
    }
  }
}
