import { IEmployee } from '@bits404/api-interfaces';
import { Exclude, Expose } from "class-transformer";
import { BaseDBObject } from '../../../../core/dto/base-db-object';

@Exclude()
export class MaintenanceEmployeeDto extends BaseDBObject implements IEmployee {

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
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
  documents: {
    driversLicense: {
      type: string,
      dueDate: Date,
      attachmentPath: string,
    },
    psychophysicistTest: {
      date: Date,
      expirationDate: Date,
      attachmentPath: string,
    },
    ine: {
      attachmentPath: string[],
    },
  };

  imagePath: string;
  status: number;
}
