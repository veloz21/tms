import { IQueryParams, IQueryResults } from '@bits404/api-interfaces';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { forkJoin } from 'rxjs';
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

  findAll(queryParams: IQueryParams, options: HttpOptions): Promise<IQueryResults> {
    const limit = Number(queryParams.pageSize);
    const skip = Number(queryParams.pageNumber * queryParams.pageSize);

    const baseQuery = this.userModel.find({ company: options.company }).session(options.session);
    const query = this.userModel.find().merge(baseQuery).sort({ [queryParams.sortField]: queryParams.sortOrder }).limit(limit).skip(skip);
    const countQuery = this.userModel.find().merge(baseQuery).count();

    return forkJoin({
      items: query.exec(),
      totalCount: countQuery.exec(),
    }).toPromise();
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
