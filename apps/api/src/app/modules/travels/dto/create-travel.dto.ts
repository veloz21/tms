import { ITravel } from '@bits404/api-interfaces';
import { Type } from "class-transformer";
import { BaseDBObject } from '../../../core/dto/base-db-object';
import { TravelBoxDto } from "./travel-box.dto";
import { TravelEmployeeDto } from "./travel-employee.dto";
import { TravelStatusDto } from "./travel-status.dto";
import { TravelTruckDto } from "./travel-truck.dto";

export class CreateTravelDto extends BaseDBObject implements ITravel {

  @Type(() => TravelEmployeeDto)
  operator: TravelEmployeeDto;

  @Type(() => TravelBoxDto)
  box: TravelBoxDto;

  @Type(() => TravelTruckDto)
  truck: TravelTruckDto;

  locations: {
    origin: { type: 'Point', coordinates: number[] },
    destination: { type: 'Point', coordinates: number[] },
  };

  @Type(() => TravelStatusDto)
  status: TravelStatusDto[];

  currentStatus: string;
  comments: string;
}
