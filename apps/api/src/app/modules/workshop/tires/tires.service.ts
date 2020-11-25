import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTireDto } from './dto/create-tire.dto';
import { UpdateTireDto } from './dto/update-tire.dto';
import { Tire, TireDocument } from './schemas/tire.schema';

@Injectable()
export class TiresService {

  constructor(
    @InjectModel(Tire.name) private readonly tireModel: Model<TireDocument>,
  ) { }

  create(createTireDto: CreateTireDto): Promise<TireDocument> {
    return new this.tireModel(createTireDto).save();
  }

  findAll(): Promise<TireDocument[]> {
    return this.tireModel.find().exec();
  }

  findOne(_id: string): Promise<TireDocument> {
    return this.tireModel.findOne({ _id }).exec();
  }

  update(_id: string, updateTireDto: UpdateTireDto): Promise<TireDocument> {
    return this.tireModel.findOneAndUpdate({ _id }, { $set: updateTireDto }, { new: true }).exec();
  }

  remove(_id: string): Promise<TireDocument> {
    return this.tireModel.findOneAndRemove({ _id }).exec();
  }
}
