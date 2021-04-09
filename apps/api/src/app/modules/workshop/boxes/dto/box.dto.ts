import { IBox, Status } from '@bits404/api-interfaces';
import { Exclude, Expose, Type } from "class-transformer";
import { BaseDBObject } from '../../../../core/dto/base-db-object';
import { SubdocumentTireDto } from '../../tires/dto/subdocument-tire.dto';

@Exclude()
export class BoxDto extends BaseDBObject implements IBox {

  @Expose()
  boxModel: string;

  @Expose()
  type: string;

  @Expose()
  rangeTraveled: number;

  @Expose()
  nickname: string;

  @Expose()
  serialNumber: string;

  @Expose()
  brand: string;

  @Expose()
  price: number;

  @Expose()
  status: number & Status;

  @Expose()
  imagePath: string;

  @Expose()
  @Type(() => SubdocumentTireDto)
  tires: SubdocumentTireDto[];
}
