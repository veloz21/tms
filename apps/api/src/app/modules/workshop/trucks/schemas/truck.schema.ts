import { ITruck } from '@bits404/api-interfaces';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Tire, TireSchema } from '../../tires/schemas/tire.schema';

export type TruckDocument = Truck & Document;

@Schema()
export class Truck implements ITruck {
  @Prop()
  truckModel: string;
  
  @Prop()
  brand: string;
  
  @Prop()
  serialNumber: string;
  
  @Prop()
  motorNumber: string;
  
  @Prop()
  maintenancePeriod: string;
  
  @Prop()
  initialRange: number;
  
  @Prop()
  rangeTraveled: number;
  
  @Prop()
  circulationCard: string;
  
  @Prop()
  airbag: string;
  
  @Prop()
  dock: string;
  
  @Prop({ type: [TireSchema], default: [] })
  tires: Tire[];
  
  @Prop()
  tenantId: string;
}


export const TruckSchema = SchemaFactory.createForClass(Truck);