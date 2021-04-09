import { IBox, Status } from '@bits404/api-interfaces';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { Company } from '../../../admin/company';
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
  nickname: string;

  @Prop()
  serialNumber: string;

  @Prop()
  brand: string;

  @Prop()
  price: number;

  @Prop({ type: Number })
  status: number & Status;

  @Prop()
  imagePath: string;

  @Prop({ type: [TireSchema], default: [] })
  tires: Partial<Tire>[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Company.name })
  company: mongoose.Types.ObjectId;
}

export const BoxSchema = SchemaFactory.createForClass(Box);
export const BoxSubdocumentSchema = SchemaFactory.createForClass(Box);

BoxSchema.index({ company: 1, serialNumber: 1 }, { unique: true });