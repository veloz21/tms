import { IMaintenance } from '@bits404/api-interfaces';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { Company } from '../../../admin/company';
import { Employee, EmployeeSubdocumentSchema } from '../../../admin/employees/schemas/employee.schema';
import { Box, BoxSubdocumentSchema } from '../../boxes/schemas/box.schema';
import { Truck, TruckSubdocumentSchema } from '../../trucks/schemas/truck.schema';

export type MaintenanceDocument = Maintenance & Document;

@Schema()
export class Maintenance implements IMaintenance {

  @Prop({ type: TruckSubdocumentSchema, default: [], required: false })
  truck: Partial<Truck>;

  @Prop({ type: BoxSubdocumentSchema, default: [], required: false })
  box: Partial<Box>;

  @Prop({ type: EmployeeSubdocumentSchema, default: [], required: false })
  mechanic: Partial<Employee>;

  @Prop()
  reasons: string;

  @Prop()
  comments: string;

  @Prop()
  price: number;

  @Prop({ type: { start: Date, end: Date }, default: [] })
  times: {
    start: Date,
    end: Date,
  };

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Company.name })
  company: mongoose.Types.ObjectId;
}

export const MaintenanceSchema = SchemaFactory.createForClass(Maintenance);