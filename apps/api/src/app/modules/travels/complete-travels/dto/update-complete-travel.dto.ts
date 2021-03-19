import { PartialType } from '@nestjs/mapped-types';
import { CreateCompleteTravelDto } from './create-complete-travel.dto';

export class UpdateCompleteTravelDto extends PartialType(CreateCompleteTravelDto) {}
