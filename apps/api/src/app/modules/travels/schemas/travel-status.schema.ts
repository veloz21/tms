import { ITravelStatus, Status } from '@bits404/api-interfaces';
import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { Company } from '../../admin/company';

export type TravelStatusDocument = TravelStatus & Document;

@Schema()
export class TravelStatus implements ITravelStatus {

  @Prop({ type: Date, default: null })
  date: Date;

  @Prop({ type: String, default: '' })
  name: string;

  @Prop({ type: String, default: '' })
  comments: string;

  @Prop(raw({
    box: { type: Number },
    truck: { type: Number },
    employee: { type: Number },
  }))
  relatedStatus: {
    box?: number & Status,
    truck?: number & Status,
    employee?: number & Status,
  };

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Company.name })
  company: mongoose.Types.ObjectId;
}

export const TravelStatusSchema = SchemaFactory.createForClass(TravelStatus);
export const TravelStatusSubdocumentSchema = SchemaFactory.createForClass(TravelStatus);