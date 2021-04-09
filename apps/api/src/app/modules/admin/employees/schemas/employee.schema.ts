import { IEmployee, Status } from '@bits404/api-interfaces';
import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { Company } from '../../company';
import { User } from '../../users/schemas/user.schema';
import { EmployeeDocuments, EmployeeDocumentsSchema } from './employee-documents';

export type EmployeeDocument = Employee & Document;

@Schema()
export class Employee extends User implements IEmployee {

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  cellphone: string;

  @Prop()
  address: string;

  @Prop()
  birthDate: Date;

  @Prop()
  type: string;

  @Prop()
  admissionDate: Date;

  @Prop()
  secondaryCellphone: string;

  @Prop({ type: Number })
  status: number & Status;

  @Prop(raw({
    currency: { type: String },
    total: { type: Number }
  }))
  salary: {
    currency: string,
    total: number,
  };

  @Prop({ type: EmployeeDocumentsSchema, default: {} })
  documents: EmployeeDocuments;

  @Prop()
  imagePath: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Company.name })
  company: mongoose.Types.ObjectId;
}

export const EmployeeSchema = SchemaFactory.createForClass(Employee);
export const EmployeeSubdocumentSchema = SchemaFactory.createForClass(Employee);

EmployeeSchema.index({ company: 1, firstName: 1, lastName: 1 }, { unique: true });