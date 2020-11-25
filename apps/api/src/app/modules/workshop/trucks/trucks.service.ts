import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTruckDto } from './dto/create-truck.dto';
import { UpdateTruckDto } from './dto/update-truck.dto';
import { Truck, TruckDocument } from './schemas/truck.schema';

@Injectable()
export class TrucksService {

  constructor(
    @InjectModel(Truck.name) private readonly truckModel: Model<TruckDocument>,
  ) { }

  create(createTruckDto: CreateTruckDto): Promise<Truck> {
    return new this.truckModel(createTruckDto).save();
  }

  findAll(): Promise<Truck[]> {
    return this.truckModel.find().exec();
  }

  findOne(id: string): Promise<Truck> {
    return this.truckModel.findOne({ id }).exec();
  }

  update(id: string, updateTruckDto: UpdateTruckDto): Promise<Truck> {
    return this.truckModel.findOneAndUpdate({ id }, updateTruckDto).exec();
  }

  remove(id: string): Promise<Truck> {
    return this.truckModel.findOneAndRemove({ id }).exec();
  }
}
