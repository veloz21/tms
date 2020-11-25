import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateMaintenanceDto } from './dto/create-maintenance.dto';
import { UpdateMaintenanceDto } from './dto/update-maintenance.dto';
import { Maintenance, MaintenanceDocument } from './schemas/maintenance.schema';

@Injectable()
export class MaintenancesService {

  constructor(
    @InjectModel(Maintenance.name) private readonly maintenanceModel: Model<MaintenanceDocument>,
  ) { }

  create(createMaintenanceDto: CreateMaintenanceDto): Promise<MaintenanceDocument> {
    return new this.maintenanceModel(createMaintenanceDto).save();
  }

  findAll(): Promise<MaintenanceDocument[]> {
    return this.maintenanceModel.find().exec();
  }

  findOne(_id: string): Promise<MaintenanceDocument> {
    return this.maintenanceModel.findOne({ _id }).exec();
  }

  update(_id: string, updateMaintenanceDto: UpdateMaintenanceDto): Promise<MaintenanceDocument> {
    return this.maintenanceModel.findOneAndUpdate({ _id }, updateMaintenanceDto).exec();
  }

  remove(_id: string): Promise<MaintenanceDocument> {
    return this.maintenanceModel.findOneAndRemove({ _id }).exec();
  }
}
