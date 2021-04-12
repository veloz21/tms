import { PartialType } from '@nestjs/mapped-types';
import { TravelDto } from './travel.dto';

export class CreateTravelDto extends PartialType(TravelDto) { }