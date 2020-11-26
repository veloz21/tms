import { IQueryParams, IQueryResults } from '@bits404/api-interfaces';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { forkJoin } from 'rxjs';
import type { HttpOptions } from '../../../core/interfaces';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Employee, EmployeeDocument } from './schemas/employee.schema';

@Injectable()
export class EmployeesService {

  constructor(
    @InjectModel(Employee.name) private readonly employeeModel: Model<EmployeeDocument>,
  ) { }

  create(createEmployeeDto: CreateEmployeeDto, options: HttpOptions): Promise<EmployeeDocument> {
    return new this.employeeModel({
      ...createEmployeeDto,
      company: options.company,
    }).save({ session: options.session });
  }

  findAll(queryParams: IQueryParams, options: HttpOptions): Promise<IQueryResults> {
    const limit = queryParams.pageSize;
    const skip = queryParams.pageNumber * queryParams.pageSize;
    const query = this.employeeModel.find({ company: options.company }).sort({ [queryParams.sortField]: queryParams.sortOrder }).session(options.session);
    return forkJoin({
      items: query.limit(limit).skip(skip).exec(),
      totalCount: query.count().exec(),
    }).toPromise();
  }

  findOne(_id: string, options: HttpOptions): Promise<EmployeeDocument> {
    return this.employeeModel.findOne({ _id, company: options.company }).session(options.session).exec();
  }

  update(_id: string, updateEmployeeDto: UpdateEmployeeDto, options: HttpOptions): Promise<EmployeeDocument> {
    return this.employeeModel.findOneAndUpdate({ _id, company: options.company }, { $set: updateEmployeeDto }, { new: true, session: options.session }).exec();
  }

  remove(_id: string, options: HttpOptions): Promise<EmployeeDocument> {
    return this.employeeModel.findOneAndRemove({ _id, company: options.company }, { session: options.session, }).exec();
  }
}
