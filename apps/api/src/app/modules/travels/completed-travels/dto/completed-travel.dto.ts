import { PartialType } from "@nestjs/mapped-types";
import { TravelDto } from "../../dto/travel.dto";

export class CompletedTravelDto extends PartialType(TravelDto) { }
