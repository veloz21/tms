import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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

  findAll(options: HttpOptions): Promise<EmployeeDocument[]> {
    return this.employeeModel.find({ company: options.company }).session(options.session).exec();
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
