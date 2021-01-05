import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Travel } from './travel.schema';

export type completedTravelDocument = completedTravel & Document;

@Schema()
export class completedTravel extends Travel {

}

export const completedTravelSchema = SchemaFactory.createForClass(completedTravel);

completedTravelSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, el) {
    el.id = el._id;
    delete el._id;
    delete el.company;
  }
});