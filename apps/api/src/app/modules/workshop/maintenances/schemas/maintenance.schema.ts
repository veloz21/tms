import { IMaintenance } from '@bits404/api-interfaces';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Employee, EmployeeSchema } from '../../../admin/employees/schemas/employee.schema';
import { Box, BoxSchema } from '../../boxes/schemas/box.schema';
import { Truck, TruckSchema } from '../../trucks/schemas/truck.schema';

export type MaintenanceDocument = Maintenance & Document;

@Schema()
export class Maintenance implements IMaintenance {

  @Prop({ type: TruckSchema, default: [], required: false })
  truck: Partial<Truck>;

  @Prop({ type: BoxSchema, default: [], required: false })
  box: Partial<Box>;

  @Prop({ type: EmployeeSchema, default: [], required: false })
  mechanic: Partial<Employee>;

  @Prop()
  reasons: string;

  @Prop()
  comments: string;

  @Prop({ type: { start: Date, end: Date }, default: [] })
  times: {
    start: Date,
    end: Date,
  };

  @Prop()
  tenantId: string;
}

export const MaintenanceSchema = SchemaFactory.createForClass(Maintenance);