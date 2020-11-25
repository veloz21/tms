import { Injectable } from '@nestjs/common';
import { CreateTruckDto } from './dto/create-truck.dto';
import { UpdateTruckDto } from './dto/update-truck.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Truck, TruckDocument } from './schemas/truck.schema';
import { Model } from 'mongoose';

@Injectable()
export class TrucksService {

  constructor(
    @InjectModel(Truck.name) private readonly truckModel: Model<TruckDocument>,
  ) { }

  async create(createTruckDto: CreateTruckDto): Promise<Truck> {
    return new this.truckModel(createTruckDto).save();
  }

  async findAll(): Promise<Truck[]> {
    return this.truckModel.find().exec();
  }

  async findOne(id: number): Promise<Truck> {
    return this.truckModel.findOne({ id }).exec();
  }

  async update(id: number, updateTruckDto: UpdateTruckDto): Promise<Truck> {
    return this.truckModel.findOneAndUpdate({ id }, updateTruckDto).exec();
  }

  async remove(id: number): Promise<Truck> {
    return this.truckModel.findOneAndRemove({ id }).exec();
  }
}
