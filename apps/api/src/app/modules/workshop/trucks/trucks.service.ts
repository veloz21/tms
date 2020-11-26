import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import type { HttpOptions } from '../../../core/interfaces';
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

  findAll(options: HttpOptions): Promise<TruckDocument[]> {
    return this.truckModel.find({ company: options.company }).session(options.session).exec();
  }

  findOne(_id: string, options: HttpOptions): Promise<TruckDocument> {
    return this.truckModel.findOne({ _id, company: options.company }).session(options.session).exec();
  }

  update(_id: string, updateTruckDto: UpdateTruckDto, options: HttpOptions): Promise<TruckDocument> {
    return this.truckModel.findOneAndUpdate({ _id, company: options.company }, { $set: updateTruckDto }, { new: true, session: options.session }).exec();
  }

  remove(_id: string, options: HttpOptions): Promise<TruckDocument> {
    return this.truckModel.findOneAndRemove({ _id, company: options.company }, { session: options.session, }).exec();
  }
}
