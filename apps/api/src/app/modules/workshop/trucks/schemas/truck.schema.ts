import { ITruck } from '@bits404/api-interfaces';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { Company } from '../../../admin/company';
import { Tire, TireSchema } from '../../tires/schemas/tire.schema';

export type TruckDocument = Truck & Document;

@Schema()
export class Truck implements ITruck {
  @Prop()
  truckModel: string;

  @Prop()
  brand: string;

  @Prop()
  nickname: string;

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
  price: number;

  @Prop()
  circulationCard: string;

  @Prop()
  airbag: string;

  @Prop()
  dock: string;

  @Prop()
  status: number;

  @Prop()
  imagePath: string;

  @Prop({ type: [TireSchema], default: [] })
  tires: Partial<Tire>[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Company.name })
  company: mongoose.Types.ObjectId;
}

export const TruckSchema = SchemaFactory.createForClass(Truck);
export const TruckSubdocumentSchema = SchemaFactory.createForClass(Truck);

TruckSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, el) {
    el.id = el._id;
    delete el._id;
    delete el.company;
  }
});

TruckSubdocumentSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, el) {
    el.id = el._id;
    delete el._id;
    delete el.company;
  }
});