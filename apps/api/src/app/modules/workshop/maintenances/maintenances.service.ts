import { IQueryParams, IQueryResults } from '@bits404/api-interfaces';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { forkJoin } from 'rxjs';
import type { HttpOptions } from '../../../core/interfaces';
import { CreateMaintenanceDto } from './dto/create-maintenance.dto';
import { UpdateMaintenanceDto } from './dto/update-maintenance.dto';
import { Maintenance, MaintenanceDocument } from './schemas/maintenance.schema';

@Injectable()
export class MaintenancesService {

  constructor(
    @InjectModel(Maintenance.name) private readonly maintenanceModel: Model<MaintenanceDocument>,
  ) { }

  create(createMaintenanceDto: CreateMaintenanceDto, options: HttpOptions): Promise<MaintenanceDocument> {
    return new this.maintenanceModel({
      ...createMaintenanceDto,
      company: options.company,
    }).save({ session: options.session });
  }

  findAll(queryParams: IQueryParams, options: HttpOptions): Promise<IQueryResults> {
    const limit = queryParams.pageSize;
    const skip = queryParams.pageNumber * queryParams.pageSize;
    const query = this.maintenanceModel.find({ company: options.company }).sort({ [queryParams.sortField]: queryParams.sortOrder }).session(options.session);
    return forkJoin({
      items: query.limit(limit).skip(skip).exec(),
      totalCount: query.count().exec(),
    }).toPromise();
  }

  findOne(_id: string, options: HttpOptions): Promise<MaintenanceDocument> {
    return this.maintenanceModel.findOne({ _id, company: options.company }).session(options.session).exec();
  }

  update(_id: string, updateMaintenanceDto: UpdateMaintenanceDto, options: HttpOptions): Promise<MaintenanceDocument> {
    return this.maintenanceModel.findOneAndUpdate({ _id, company: options.company }, { $set: updateMaintenanceDto }, { new: true, session: options.session }).exec();
  }

  remove(_id: string, options: HttpOptions): Promise<MaintenanceDocument> {
    return this.maintenanceModel.findOneAndRemove({ _id, company: options.company }, { session: options.session, }).exec();
  }
}
