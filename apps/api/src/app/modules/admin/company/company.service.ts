import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Model } from 'mongoose';
import type { HttpOptions } from '../../../core/interfaces';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company, CompanyDocument } from './schemas/company.schema';

@Injectable()
export class CompanyService {
  constructor(
    @InjectModel(Company.name)
    private readonly companyModel: Model<CompanyDocument>
  ) { }

  create(
    createCompanyDto: CreateCompanyDto,
    options: HttpOptions
  ): Promise<CompanyDocument> {
    return new this.companyModel(createCompanyDto).save({
      session: options.session,
    });
  }

  findAll(options: HttpOptions): Promise<CompanyDocument[]> {
    return this.companyModel.find({ _id: options.company }).exec();
  }

  findOne(_id: string | mongoose.Types.ObjectId, options?: HttpOptions): Promise<CompanyDocument> {
    return this.companyModel.findOne({ _id }).session(options.session).exec();
  }

  findOneByName(
    companyName: string,
    options?: HttpOptions
  ): Promise<CompanyDocument> {
    return this.companyModel
      .findOne({ name: companyName })
      .session(options && options.session)
      .exec();
  }

  update(
    _id: string,
    updateCompanyDto: UpdateCompanyDto,
    options: HttpOptions
  ): Promise<CompanyDocument> {
    return this.companyModel
      .findOneAndUpdate(
        { _id },
        { $set: updateCompanyDto },
        { new: true, session: options.session }
      )
      .exec();
  }

  partialUpdate(
    _id: string,
    partialUser: Partial<CompanyDocument>,
    options: HttpOptions
  ): Promise<CompanyDocument> {
    return this.companyModel
      .update({ _id }, { $set: partialUser }, { session: options.session })
      .exec();
  }

  remove(_id: string, options?: HttpOptions): Promise<CompanyDocument> {
    return this.companyModel
      .findOneAndRemove({ _id }, { session: options.session })
      .exec();
  }
}
