import { IQueryParams, IQueryResults } from '@bits404/api-interfaces';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { forkJoin } from 'rxjs';
import type { HttpOptions } from '../../../core/interfaces';
import { CreateCompleteTravelDto } from './dto/create-complete-travel.dto';
import { UpdateCompleteTravelDto } from './dto/update-complete-travel.dto';
import { CompleteTravel, completeTravelDocument } from './schemas/completed_travel.schema';
@Injectable()
export class CompleteTravelsService {
  constructor(
    @InjectModel(CompleteTravel.name)
    private readonly completeTravelModel: Model<completeTravelDocument>
  ) {}

  create(createCompleteTravelDto: CreateCompleteTravelDto, options: HttpOptions): Promise<completeTravelDocument> {
    return new this.completeTravelModel({
      ...createCompleteTravelDto,
      company: options.company,
    }).save({ session: options.session });
  }

  findAll(queryParams: IQueryParams, options: HttpOptions): Promise<IQueryResults> {
    const limit = Number(queryParams.pageSize);
    const skip = Number(queryParams.pageNumber * queryParams.pageSize);

    const baseQuery = this.completeTravelModel.find({ company: options.company }).session(options.session);
    const query = this.completeTravelModel
      .find()
      .merge(baseQuery)
      .sort({ [queryParams.sortField]: queryParams.sortOrder })
      .limit(limit)
      .skip(skip);
    const countQuery = this.completeTravelModel.find().merge(baseQuery).count();

    return forkJoin({
      items: query.exec(),
      totalCount: countQuery.exec(),
    }).toPromise();
  }

  findOne(_id: string, options: HttpOptions): Promise<completeTravelDocument> {
    return this.completeTravelModel.findOne({ _id, company: options.company }).session(options.session).exec();
  }

  update(_id: string, updateTravelDto: UpdateCompleteTravelDto, options: HttpOptions): Promise<completeTravelDocument> {
    return this.completeTravelModel.findOneAndUpdate({ _id, company: options.company }, { $set: updateTravelDto }, { new: true, session: options.session }).exec();
  }

  remove(_id: string, options: HttpOptions): Promise<completeTravelDocument> {
    return this.completeTravelModel.findOneAndRemove({ _id, company: options.company }, { session: options.session }).exec();
  }
}
