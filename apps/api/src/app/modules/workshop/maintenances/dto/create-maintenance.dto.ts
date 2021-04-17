import { PartialType } from "@nestjs/mapped-types";
import { MaintenanceDto } from "./maintenance.dto";

export class CreateMaintenanceDto extends PartialType(MaintenanceDto) { }
