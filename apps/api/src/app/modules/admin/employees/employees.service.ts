import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Employee, EmployeeDocument } from './schemas/employee.schema';

@Injectable()
export class EmployeesService {

  constructor(
    @InjectModel(Employee.name) private readonly employeeModel: Model<EmployeeDocument>,
  ) { }


  create(createEmployeeDto: CreateEmployeeDto): Promise<EmployeeDocument> {
    return new this.employeeModel(createEmployeeDto).save();
  }

  findAll(): Promise<EmployeeDocument[]> {
    return this.employeeModel.find().exec();
  }

  findOne(_id: string): Promise<EmployeeDocument> {
    return this.employeeModel.findOne({ _id }).exec();
  }

  update(_id: string, updateEmployeeDto: UpdateEmployeeDto): Promise<EmployeeDocument> {
    return this.employeeModel.findOneAndUpdate({ _id }, updateEmployeeDto).exec();
  }

  remove(_id: string): Promise<EmployeeDocument> {
    return this.employeeModel.findOneAndRemove({ _id }).exec();
  }
}
