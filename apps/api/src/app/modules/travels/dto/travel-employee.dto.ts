import { IEmployee } from '@bits404/api-interfaces';
import { Exclude, Expose, Type } from "class-transformer";
import { BaseDBObject } from '../../../core/dto/base-db-object';
import { EmployeeDocumentsDto } from '../../admin/employees/dto/employeeDocuments.dto';

@Exclude()
class SalaryDto {

  @Expose()
  currency: string;

  @Expose()
  total: number;
}

@Exclude()
export class TravelEmployeeDto extends BaseDBObject implements IEmployee {

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  @Type(() => SalaryDto)
  salary: {
    currency: string,
    total: number,
  };

  cellphone: string;
  address: string;
  birthDate: Date;
  type: string;
  admissionDate: Date;
  secondaryCellphone: string;
  documents: EmployeeDocumentsDto;
  imagePath: string;
  status: number;
}
