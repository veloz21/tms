import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) { }

  create(createUserDto: CreateUserDto): Promise<UserDocument> {
    return new this.userModel(createUserDto).save();
  }

  findAll(): Promise<UserDocument[]> {
    return this.userModel.find().exec();
  }

  findOne(_id: string): Promise<UserDocument> {
    return this.userModel.findOne({ _id }).exec();
  }

  findOneByEmail(email: string): Promise<UserDocument> {
    return this.userModel.findOne({ email }).exec();
  }

  update(_id: string, updateUserDto: UpdateUserDto): Promise<UserDocument> {
    return this.userModel.findOneAndUpdate({ _id }, updateUserDto).exec();
  }

  partialUpdate(_id: string, partialUser: Partial<UserDocument>): Promise<UserDocument> {
    return this.userModel.update({ _id }, { $set: partialUser }).exec();
  }

  remove(_id: string): Promise<UserDocument> {
    return this.userModel.findOneAndRemove({ _id }).exec();
  }
}
