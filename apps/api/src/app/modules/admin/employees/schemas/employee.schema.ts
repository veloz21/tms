import { IEmployee } from '@bits404/api-interfaces';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EmployeeDocument = Employee & Document;

@Schema()
export class Employee implements IEmployee {
  
  @Prop()
  firstName: string;
  
  @Prop()
  lastName: string;
  
  @Prop()
  cellphone: string;
  
  @Prop()
  address: string;
  
  @Prop()
  secondaryCellphone: string;
  
  @Prop()
  salary: {
    currency: string,
    total: number,
  };
  
  @Prop()
  documents: {
    driversLicense: {
      type: string,
      dueDate: Date,
      attachmentPath: string,
    },
    phychophysicistTest: {
      date: Date,
      expirationDate: Date,
      attachmentPath: string,
    },
    ine: {
      attachmentPath: string[],
    },
  };
  
  @Prop()
  imagePath: string;
  
  @Prop()
  tenantId: string;
}

export const EmployeeSchema = SchemaFactory.createForClass(Employee);