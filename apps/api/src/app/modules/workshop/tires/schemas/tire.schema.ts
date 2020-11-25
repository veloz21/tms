import { ITire } from '@bits404/api-interfaces';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TireDocument = Tire & Document;

@Schema()
export class Tire implements ITire {

  @Prop()
  serialNumber: string;

  @Prop()
  rangeTraveled: number;

  @Prop()
  tenantId: string;
}

export const TireSchema = SchemaFactory.createForClass(Tire);