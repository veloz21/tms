import { IQueryParams, IQueryResults } from '@bits404/api-interfaces';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Model } from 'mongoose';
import { forkJoin } from 'rxjs';
import type { HttpOptions } from '../../../core/interfaces';
import { TravelStatusDto } from '../../travels/dto/travel-status.dto';
import { CreateBoxDto } from './dto/create-box.dto';
import { UpdateBoxDto } from './dto/update-box.dto';
import { Box, BoxDocument } from './schemas/box.schema';

@Injectable()
export class BoxesService {

  constructor(
    @InjectModel(Box.name) private readonly boxModel: Model<BoxDocument>,
  ) { }

  create(createBoxDto: CreateBoxDto, options: HttpOptions): Promise<BoxDocument> {
    return new this.boxModel({
      ...createBoxDto,
      company: options.company,
    }).save({ session: options.session });
  }

  findAll(queryParams: IQueryParams, options: HttpOptions): Promise<IQueryResults> {
    const limit = Number(queryParams.pageSize);
    const skip = Number(queryParams.pageNumber * queryParams.pageSize);

    const baseQuery = this.boxModel.find({ company: options.company }).session(options.session);
    const query = this.boxModel.find().merge(baseQuery).sort({ [queryParams.sortField]: queryParams.sortOrder }).limit(limit).skip(skip);
    const countQuery = this.boxModel.find().merge(baseQuery).count();

    return forkJoin({
      items: query.exec(),
      totalCount: countQuery.exec(),
    }).toPromise();
  }

  findOne(_id: mongoose.Types.ObjectId, options: HttpOptions): Promise<BoxDocument> {
    return this.boxModel.findOne({ _id, company: options.company }).session(options.session).exec();
  }

  update(_id: mongoose.Types.ObjectId, updateBoxDto: UpdateBoxDto, options: HttpOptions): Promise<BoxDocument> {
    return this.boxModel.findOneAndUpdate({ _id, company: options.company }, { $set: updateBoxDto }, { new: true, session: options.session }).exec();
  }

  remove(_id: mongoose.Types.ObjectId, options: HttpOptions): Promise<BoxDocument> {
    return this.boxModel.findOneAndRemove({ _id, company: options.company }, { session: options.session, }).exec();
  }

  updateStatusByTravelStatus(_id: mongoose.Types.ObjectId, travelStatus: TravelStatusDto, options: HttpOptions): Promise<BoxDocument> {
    if (travelStatus && travelStatus.relatedStatus && travelStatus.relatedStatus.box !== undefined) {
      return this.boxModel.findOneAndUpdate({ _id, company: options.company }, { $set: { "status": travelStatus.relatedStatus.box } }, { session: options.session }).exec();
    }
  }
}
