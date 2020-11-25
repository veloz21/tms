import { ITravel } from '@bits404/api-interfaces';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Employee } from '../../admin/employees/schemas/employee.schema';
import { Box } from '../../workshop/boxes/schemas/box.schema';
import { Truck } from '../../workshop/trucks/schemas/truck.schema';

export type TravelDocument = Travel & Document;

@Schema()
export class Travel implements ITravel {
  
  @Prop()
  operator: Partial<Employee>;
  
  @Prop()
  box: Partial<Box>;
  
  @Prop()
  truck: Partial<Truck>;
  
  // GeoJson type
  @Prop()
  locations: {
    origin: { type: 'Point', coordinates: number[] },
    destination: { type: 'Point', coordinates: number[] },
  };
  
  @Prop()
  times: {
    loading: Date;
    unloading: Date;
    originArrive: Date;
    destinationArrive: Date;
  };
  
  @Prop()
  comments: string;
  
  @Prop()
  tenantId: string;
}

export const TravelSchema = SchemaFactory.createForClass(Travel);