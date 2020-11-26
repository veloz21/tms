import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HttpOptions } from '../../../core/interfaces';
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

  findAll(options: HttpOptions): Promise<TireDocument[]> {
    return this.tireModel.find({ company: options.company }).exec();
  }

  findOne(_id: string, options: HttpOptions): Promise<TireDocument> {
    return this.tireModel.findOne({ _id, company: options.company }).exec();
  }

  update(_id: string, updateTireDto: UpdateTireDto, options: HttpOptions): Promise<TireDocument> {
    return this.tireModel.findOneAndUpdate({ _id, company: options.company }, { $set: updateTireDto }, { new: true, session: options.session }).exec();
  }

  remove(_id: string, options: HttpOptions): Promise<TireDocument> {
    return this.tireModel.findOneAndRemove({ _id, company: options.company }, { session: options.session }).exec();
  }
}
