import { ITire } from '@bits404/api-interfaces';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { Company } from '../../../admin/company';

export type TireDocument = Tire & Document;

@Schema()
export class Tire implements ITire {

  @Prop()
  serialNumber: string;

  @Prop()
  rangeTraveled: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Company.name })
  company: Company;
}

export const TireSchema = SchemaFactory.createForClass(Tire);

TireSchema.index({ company: 1, serialNumber: 1 }, { unique: true, sparse: true });

TireSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, el) {
    el.id = el._id;
    delete el._id;
  }
});