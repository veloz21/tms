import { ITruck, Status } from '@bits404/api-interfaces';
import { Exclude, Expose, Type } from "class-transformer";
import { BaseDBObject } from '../../../../core/dto/base-db-object';
import { SubdocumentTireDto } from '../../tires/dto/subdocument-tire.dto';

@Exclude()
export class TruckDto extends BaseDBObject implements ITruck {

  @Expose()
  truckModel: string;

  @Expose()
  brand: string;

  @Expose()
  nickname: string;

  @Expose()
  serialNumber: string;

  @Expose()
  motorNumber: string;

  @Expose()
  maintenancePeriod: string;

  @Expose()
  initialRange: number;

  @Expose()
  rangeTraveled: number;

  @Expose()
  circulationCard: string;

  @Expose()
  price: number;

  @Expose()
  airbag: string;

  @Expose()
  dock: string;

  @Expose()
  status: number & Status;

  @Expose()
  imagePath: string;

  @Expose()
  @Type(() => SubdocumentTireDto)
  tires: SubdocumentTireDto[];
}
