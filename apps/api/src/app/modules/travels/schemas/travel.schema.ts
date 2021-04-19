import { ITravel } from '@bits404/api-interfaces';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { Company } from '../../admin/company';
import { Employee, EmployeeSubdocumentSchema } from '../../admin/employees/schemas/employee.schema';
import { Box, BoxSubdocumentSchema } from '../../workshop/boxes';
import { Truck, TruckSubdocumentSchema } from '../../workshop/trucks';
import { Expense, ExpenseSubdocumentSchema } from '../expenses/schemas/expenses.schema';
import { TravelLocations, TravelLocationsSchema } from './travel-locations.schema';
import { TravelStatus, TravelStatusSubdocumentSchema } from './travel-status.schema';

export type TravelDocument = Travel & Document;

@Schema({ timestamps: true })
export class Travel implements ITravel {

  @Prop({ type: EmployeeSubdocumentSchema, default: {} })
  operator: Partial<Employee>;

  @Prop({ type: BoxSubdocumentSchema, default: {} })
  box: Partial<Box>;

  @Prop({ type: TruckSubdocumentSchema, default: {} })
  truck: Partial<Truck>;

  @Prop()
  salePrice: number;

  @Prop({ type: TravelLocationsSchema, default: {} })
  locations: TravelLocations;

  @Prop({ type: [ExpenseSubdocumentSchema], default: [] })
  expenses: Partial<Expense>[];

  @Prop({ type: [TravelStatusSubdocumentSchema], default: {} })
  status: Partial<TravelStatus>[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: TravelStatus.name })
  currentStatus: mongoose.Types.ObjectId;

  @Prop()
  comments: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Company.name, required: true })
  company: mongoose.Types.ObjectId;
}

export const TravelSchema = SchemaFactory.createForClass(Travel);
