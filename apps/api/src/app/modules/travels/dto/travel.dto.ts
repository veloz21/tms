import { ITravel } from "@bits404/api-interfaces";
import { Exclude, Expose, Transform, Type } from "class-transformer";
import { Types } from 'mongoose';
import { BaseDBObject } from '../../../core/dto/base-db-object';
import { ExpenseDto } from "../expenses/dto/expense.dto";
import { TravelBoxDto } from "./travel-box.dto";
import { TravelEmployeeDto } from "./travel-employee.dto";
import { TravelLocationsDto } from './travel-locations.dto';
import { TravelStatusDto } from "./travel-status.dto";
import { TravelTruckDto } from "./travel-truck.dto";

@Exclude()
export class TravelDto extends BaseDBObject implements ITravel {

  @Expose()
  @Type(() => TravelEmployeeDto)
  operator: TravelEmployeeDto;

  @Expose()
  @Type(() => TravelBoxDto)
  box: TravelBoxDto;

  @Expose()
  @Type(() => TravelTruckDto)
  truck: TravelTruckDto;

  @Expose()
  @Type(() => TravelLocationsDto)
  locations: TravelLocationsDto;

  @Expose()
  @Type(() => ExpenseDto)
  expenses: ExpenseDto[];

  @Expose()
  @Type(() => TravelStatusDto)
  status: TravelStatusDto[];

  @Expose()
  salePrice: number;

  @Expose()
  @Transform(value => value && new Types.ObjectId(value), { toClassOnly: true })
  @Transform(value => value && value.toString(), { toPlainOnly: true })
  currentStatus: Types.ObjectId;

  @Expose()
  comments: string;
}
