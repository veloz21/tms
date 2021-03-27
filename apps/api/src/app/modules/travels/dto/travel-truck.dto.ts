import { ITruck } from '@bits404/api-interfaces';
import { Exclude, Expose, Type } from "class-transformer";
import { BaseDBObject } from '../../../core/dto/base-db-object';
import { SubdocumentTireDto } from "../../workshop/tires/dto/subdocument-tire.dto";

@Exclude()
export class TravelTruckDto extends BaseDBObject implements ITruck {

  @Expose()
  nickname: string;

  @Expose()
  rangeTraveled: number;

  truckModel: string;
  brand: string;
  serialNumber: string;
  motorNumber: string;
  maintenancePeriod: string;
  initialRange: number;
  circulationCard: string;
  price: number;
  airbag: string;
  dock: string;
  status: number;
  imagePath: string;

  @Expose()
  @Type(() => SubdocumentTireDto)
  tires: SubdocumentTireDto[];
}