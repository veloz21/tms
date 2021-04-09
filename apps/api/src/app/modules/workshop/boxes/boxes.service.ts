import { IQueryParams, IQueryResults } from '@bits404/api-interfaces';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Model } from 'mongoose';
import { forkJoin } from 'rxjs';
import type { HttpOptions } from '../../../core/interfaces';
import { TravelStatus, TravelStatusDocument } from '../../travels/schemas/travel-status.schema';
import { CreateBoxDto } from './dto/create-box.dto';
import { UpdateBoxDto } from './dto/update-box.dto';
import { Box, BoxDocument } from './schemas/box.schema';

@Injectable()
export class BoxesService {

  constructor(
    @InjectModel(Box.name) private readonly boxModel: Model<BoxDocument>,
    @InjectModel(TravelStatus.name) private readonly travelStatusModel: Model<TravelStatusDocument>,
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

  async updateStatusByTravelStatus(_id: mongoose.Types.ObjectId, travelStatusId: mongoose.Types.ObjectId, options: HttpOptions): Promise<BoxDocument> {
    const travelStatus = await this.travelStatusModel.findOne({ _id: travelStatusId, company: options.company }).select('relatedStatus.truck').session(options.session).exec()
    if (travelStatus && travelStatus.relatedStatus && travelStatus.relatedStatus.box) {
      return this.boxModel.findOneAndUpdate({ _id, company: options.company }, { $set: { "status": travelStatus.relatedStatus.box } }, { session: options.session }).exec();
    }
  }
}
