import { IBox } from '@bits404/api-interfaces';
import { Exclude, Expose, Type } from "class-transformer";
import { BaseDBObject } from '../../../../core/dto/base-db-object';
import { SubdocumentTireDto } from '../../tires/dto/subdocument-tire.dto';

@Exclude()
export class MaintenanceBoxDto extends BaseDBObject implements IBox {

  @Expose()
  rangeTraveled: number;

  @Expose()
  nickname: string;

  @Expose()
  boxModel: string;

  type: string;

  @Expose()
  serialNumber: string;

  @Expose()
  brand: string;

  price: number;

  imagePath: string;

  status: number;

  @Expose()
  @Type(() => SubdocumentTireDto)
  tires: SubdocumentTireDto[];
}