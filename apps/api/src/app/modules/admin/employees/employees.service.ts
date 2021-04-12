import { IQueryParams, IQueryResults } from '@bits404/api-interfaces';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { forkJoin } from 'rxjs';
import type { HttpOptions } from '../../../core/interfaces';
import { TravelStatusDto } from '../../travels/dto/travel-status.dto';
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
    const limit = Number(queryParams.pageSize);
    const skip = Number(queryParams.pageNumber * queryParams.pageSize);

    const baseQuery = this.employeeModel.find({ company: options.company }).session(options.session);
    const query = this.employeeModel.find().merge(baseQuery).sort({ [queryParams.sortField]: queryParams.sortOrder }).limit(limit).skip(skip);
    const countQuery = this.employeeModel.find().merge(baseQuery).count();

    return forkJoin({
      items: query.exec(),
      totalCount: countQuery.exec(),
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

  updateStatusByTravelStatus(_id: Types.ObjectId, travelStatus: TravelStatusDto, options: HttpOptions): Promise<EmployeeDocument> {
    if (travelStatus && travelStatus.relatedStatus && travelStatus.relatedStatus.employee !== undefined) {
      return this.employeeModel.findOneAndUpdate({ _id, company: options.company }, { $set: { "status": travelStatus.relatedStatus.employee } }, { session: options.session }).exec();
    }
  }
}
