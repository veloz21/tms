import { IQueryParams, IQueryResults } from '@bits404/api-interfaces';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { forkJoin } from 'rxjs';
import type { HttpOptions } from '../../../core/interfaces';
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
    const limit = queryParams.pageSize;
    const skip = queryParams.pageNumber * queryParams.pageSize;
    const query = this.boxModel.find({ company: options.company }).sort({ [queryParams.sortField]: queryParams.sortOrder }).session(options.session);
    return forkJoin({
      items: query.limit(limit).skip(skip).exec(),
      totalCount: query.count().exec(),
    }).toPromise();
  }

  findOne(_id: string, options: HttpOptions): Promise<BoxDocument> {
    return this.boxModel.findOne({ _id, company: options.company }).session(options.session).exec();
  }

  update(_id: string, updateBoxDto: UpdateBoxDto, options: HttpOptions): Promise<BoxDocument> {
    return this.boxModel.findOneAndUpdate({ _id, company: options.company }, { $set: updateBoxDto }, { new: true, session: options.session }).exec();
  }

  remove(_id: string, options: HttpOptions): Promise<BoxDocument> {
    return this.boxModel.findOneAndRemove({ _id, company: options.company }, { session: options.session, }).exec();
  }
}
