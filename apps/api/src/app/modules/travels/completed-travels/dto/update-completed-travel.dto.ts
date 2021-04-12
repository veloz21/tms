import { PartialType } from '@nestjs/mapped-types';
import { CreateCompletedTravelDto } from './create-completed-travel.dto';

export class UpdateCompletedTravelDto extends PartialType(CreateCompletedTravelDto) {}
