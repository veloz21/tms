import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import type { HttpOptions } from '../../../core/interfaces';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) { }

  create(createUserDto: CreateUserDto, options: HttpOptions): Promise<UserDocument> {
    return new this.userModel({
      ...createUserDto,
      company: options.company,
    }).save({ session: options.session });
  }

  findAll(options: HttpOptions): Promise<UserDocument[]> {
    return this.userModel.find({ company: options.company }).exec();
  }

  findOne(_id: string, options: HttpOptions): Promise<UserDocument> {
    return this.userModel.findOne({ _id, company: options.company }).exec();
  }

  findOneByEmail(email: string, options?: HttpOptions): Promise<UserDocument> {
    return this.userModel.findOne({ email }).exec();
  }

  update(_id: string, updateUserDto: UpdateUserDto, options: HttpOptions): Promise<UserDocument> {
    return this.userModel.findOneAndUpdate({ _id, company: options.company }, { $set: updateUserDto }, { new: true, session: options.session }).exec();
  }

  partialUpdate(_id: string, partialUser: Partial<UserDocument>, options: HttpOptions): Promise<UserDocument> {
    return this.userModel.update({ _id, company: options.company }, { $set: partialUser }, { new: true, session: options.session }).exec();
  }

  remove(_id: string, options: HttpOptions): Promise<UserDocument> {
    return this.userModel.findOneAndRemove({ _id, company: options.company }).exec();
  }
}
