import { ITruck } from '@bits404/api-interfaces';
import { Exclude, Expose, Type } from "class-transformer";
import { BaseDBObject } from '../../../../core/dto/base-db-object';
import { SubdocumentTireDto } from '../../tires/dto/subdocument-tire.dto';

@Exclude()
export class MaintenanceTruckDto extends BaseDBObject implements ITruck {

  @Expose()
  nickname: string;

  @Expose()
  rangeTraveled: number;

  @Expose()
  truckModel: string;

  @Expose()
  brand: string;

  @Expose()
  serialNumber: string;

  @Expose()
  motorNumber: string;

  @Expose()
  maintenancePeriod: string;

  @Expose()
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