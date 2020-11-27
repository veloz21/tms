import { IQueryParams, IQueryResults } from '@bits404/api-interfaces';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { forkJoin } from 'rxjs';
import type { HttpOptions } from '../../../core/interfaces';
import { CreateTireDto } from './dto/create-tire.dto';
import { UpdateTireDto } from './dto/update-tire.dto';
import { Tire, TireDocument } from './schemas/tire.schema';

@Injectable()
export class TiresService {

  constructor(
    @InjectModel(Tire.name) private readonly tireModel: Model<TireDocument>,
  ) { }

  create(createTireDto: CreateTireDto, options: HttpOptions): Promise<TireDocument> {
    return new this.tireModel({
      ...createTireDto,
      company: options.company,
    }).save({ session: options.session });
  }

  findAll(queryParams: IQueryParams, options: HttpOptions): Promise<IQueryResults> {
    const limit = Number(queryParams.pageSize);
    const skip = Number(queryParams.pageNumber * queryParams.pageSize);

    const baseQuery = this.tireModel.find({ company: options.company }).session(options.session);
    const query = this.tireModel.find().merge(baseQuery).sort({ [queryParams.sortField]: queryParams.sortOrder }).limit(limit).skip(skip);
    const countQuery = this.tireModel.find().merge(baseQuery).count();

    return forkJoin({
      items: query.exec(),
      totalCount: countQuery.exec(),
    }).toPromise();
  }

  findOne(_id: string, options: HttpOptions): Promise<TireDocument> {
    return this.tireModel.findOne({ _id, company: options.company }).session(options.session).exec();
  }

  update(_id: string, updateTireDto: UpdateTireDto, options: HttpOptions): Promise<TireDocument> {
    return this.tireModel.findOneAndUpdate({ _id, company: options.company }, { $set: updateTireDto }, { new: true, session: options.session }).exec();
  }

  remove(_id: string, options: HttpOptions): Promise<TireDocument> {
    return this.tireModel.findOneAndRemove({ _id, company: options.company }, { session: options.session, }).exec();
  }
}
