import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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

  findAll(options: HttpOptions): Promise<MaintenanceDocument[]> {
    return this.maintenanceModel.find({ company: options.company }).session(options.session).exec();
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
