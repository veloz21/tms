import { IBox } from '@bits404/api-interfaces';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Tire, TireSchema } from '../../tires/schemas/tire.schema';

export type BoxDocument = Box & Document;

@Schema()
export class Box implements IBox {
  
  @Prop()
  boxModel: string;
  
  @Prop()
  type: string;
  
  @Prop()
  rangeTraveled: number;
  
  @Prop()
  serialNumber: string;
  
  @Prop()
  brand: string;
  
  @Prop({ type: [TireSchema], default: [] })
  tires: Tire[]
  
  @Prop()
  tenantId: string;
}

export const BoxSchema = SchemaFactory.createForClass(Box);