import { ICompletedTravel } from '@bits404/api-interfaces';
import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Travel } from '../../schemas/travel.schema';

export type CompletedTravelDocument = CompletedTravel & Document;

@Schema()
export class CompletedTravel extends Travel implements ICompletedTravel { }

export const CompletedTravelSchema = SchemaFactory.createForClass(CompletedTravel);