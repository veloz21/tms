import { ITire, Status } from '@bits404/api-interfaces';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { Company } from '../../../admin/company';

export type TireDocument = Tire & Document;

@Schema()
export class Tire implements ITire {

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Truck' })
  truckId: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Box' })
  boxId: mongoose.Types.ObjectId;

  @Prop()
  serialNumber: string;

  @Prop()
  rangeTraveled: number;

  @Prop({ type: Number })
  status: number & Status;

  @Prop({ type: Number })
  parentStatus: number & Status;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Company.name })
  company: mongoose.Types.ObjectId;
}

export const TireSchema = SchemaFactory.createForClass(Tire);
TireSchema.index({ company: 1, serialNumber: 1 }, { unique: true, sparse: true });