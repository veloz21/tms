import { IBox } from '@bits404/api-interfaces';
import { Exclude, Expose, Type } from "class-transformer";
import { BaseDBObject } from '../../../core/dto/base-db-object';
import { SubdocumentTireDto } from "../../workshop/tires/dto/subdocument-tire.dto";

@Exclude()
export class TravelBoxDto extends BaseDBObject implements IBox {

  @Expose()
  rangeTraveled: number;

  @Expose()
  nickname: string;

  boxModel: string;
  type: string;
  serialNumber: string;
  brand: string;
  price: number;
  status: number;
  imagePath: string;

  @Expose()
  @Type(() => SubdocumentTireDto)
  tires: SubdocumentTireDto[];
}