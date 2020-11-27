import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TravelLocationsDocument = TravelLocations & Document;

@Schema()
export class TravelLocations {

  @Prop(raw({
    type: { type: String },
    coordinates: { type: [Number] },
  }))
  origin: { type: 'Point', coordinates: number[] };

  @Prop(raw({
    type: { type: String },
    coordinates: { type: [Number] },
  }))
  destination: { type: 'Point', coordinates: number[] };
}

export const TravelLocationsSchema = SchemaFactory.createForClass(TravelLocations);

TravelLocationsSchema.index({ origin: '2dsphere' });
TravelLocationsSchema.index({ destination: '2dsphere' });
