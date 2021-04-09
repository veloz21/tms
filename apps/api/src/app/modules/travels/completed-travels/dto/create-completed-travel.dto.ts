import { PartialType } from "@nestjs/mapped-types";
import { CompletedTravelDto } from "./completed-travel.dto";

export class CreateCompletedTravelDto extends PartialType(CompletedTravelDto) { }
