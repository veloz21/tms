import { ITravelStatus } from '@bits404/api-interfaces';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
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

  @Prop({ type: Number })
  order: number;

  @Prop({ type: String, default: '' })
  comments: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Company.name })
  company: mongoose.Types.ObjectId;
}

export const TravelStatusSchema = SchemaFactory.createForClass(TravelStatus);
export const TravelStatusSubdocumentSchema = SchemaFactory.createForClass(TravelStatus);

TravelStatusSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, el) {
    el.id = el._id;
    delete el._id;
    delete el.company;
  }
});

TravelStatusSubdocumentSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, el) {
    el.id = el._id;
    delete el._id;
    delete el.company;
  }
});