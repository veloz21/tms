import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Travel } from '../../schemas/travel.schema';

export type completeTravelDocument = CompleteTravel & Document;

@Schema()
export class CompleteTravel extends Travel { }

export const completeTravelSchema = SchemaFactory.createForClass(CompleteTravel);