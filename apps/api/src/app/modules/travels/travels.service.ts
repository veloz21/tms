import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTravelDto } from './dto/create-travel.dto';
import { UpdateTravelDto } from './dto/update-travel.dto';
import { Travel, TravelDocument } from './schemas/travel.schema';

@Injectable()
export class TravelsService {

  constructor(
    @InjectModel(Travel.name) private readonly travelModel: Model<TravelDocument>,
  ) { }

  create(createTravelDto: CreateTravelDto): Promise<TravelDocument> {
    return new this.travelModel(createTravelDto).save();
  }

  findAll(): Promise<TravelDocument[]> {
    return this.travelModel.find().exec();
  }

  findOne(_id: string): Promise<TravelDocument> {
    return this.travelModel.findOne({ _id }).exec();
  }

  update(_id: string, updateTravelDto: UpdateTravelDto): Promise<TravelDocument> {
    return this.travelModel.findOneAndUpdate({ _id }, updateTravelDto).exec();
  }

  remove(_id: string): Promise<TravelDocument> {
    return this.travelModel.findOneAndRemove({ _id }).exec();
  }
}
