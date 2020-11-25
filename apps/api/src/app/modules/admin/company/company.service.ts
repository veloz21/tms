import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company, CompanyDocument } from './schemas/company.schema';

@Injectable()
export class CompanyService {

  constructor(
    @InjectModel(Company.name) private readonly companyModel: Model<CompanyDocument>,
  ) { }

  create(createCompanyDto: CreateCompanyDto): Promise<CompanyDocument> {
    return new this.companyModel(createCompanyDto).save();
  }

  findAll(): Promise<CompanyDocument[]> {
    return this.companyModel.find().exec();
  }

  findOne(_id: string): Promise<CompanyDocument> {
    return this.companyModel.findOne({ _id }).exec();
  }

  update(_id: string, updateCompanyDto: UpdateCompanyDto): Promise<CompanyDocument> {
    return this.companyModel.findOneAndUpdate({ _id }, updateCompanyDto).exec();
  }

  partialUpdate(_id: string, partialUser: Partial<CompanyDocument>): Promise<CompanyDocument> {
    return this.companyModel.update({ _id }, { $set: partialUser }).exec();
  }

  remove(_id: string): Promise<CompanyDocument> {
    return this.companyModel.findOneAndRemove({ _id }).exec();
  }
}
