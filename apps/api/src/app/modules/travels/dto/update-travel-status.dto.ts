import { PartialType } from '@nestjs/mapped-types';
import { TravelStatusDto } from './travel-status.dto';

export class UpdateTravelStatusDto extends PartialType(TravelStatusDto) { }
