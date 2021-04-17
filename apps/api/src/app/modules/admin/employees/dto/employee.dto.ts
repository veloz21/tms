import { IEmployee, Status } from '@bits404/api-interfaces';
import { Exclude, Expose } from "class-transformer";
import { BaseDBObject } from '../../../../core/dto/base-db-object';
import { EmployeeDocumentsDto } from './employeeDocuments.dto';

@Exclude()
export class EmployeeDto extends BaseDBObject implements IEmployee {

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  cellphone: string;

  @Expose()
  address: string;

  @Expose()
  birthDate: Date;

  @Expose()
  type: string;

  @Expose()
  admissionDate: Date;

  @Expose()
  secondaryCellphone: string;

  @Expose()
  status: number & Status;

  @Expose()
  salary: number;

  @Expose()
  documents: EmployeeDocumentsDto;

  @Expose()
  imagePath: string;
}