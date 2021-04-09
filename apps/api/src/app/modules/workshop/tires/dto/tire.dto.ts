import { ITire } from '@bits404/api-interfaces';
import { Optional } from '@nestjs/common';
import { Exclude, Expose, Transform } from "class-transformer";
import { Types } from 'mongoose';
import { BaseDBObject } from '../../../../core/dto/base-db-object';

@Exclude()
export class TireDto extends BaseDBObject implements ITire {

  @Expose()
  @Optional()
  @Transform(value => value && new Types.ObjectId(value), { toClassOnly: true })
  @Transform(value => value && value.toString(), { toPlainOnly: true })
  truckId: Types.ObjectId;

  @Expose()
  @Optional()
  @Transform(value => value && new Types.ObjectId(value), { toClassOnly: true })
  @Transform(value => value && value.toString(), { toPlainOnly: true })
  boxId: Types.ObjectId;

  @Expose()
  serialNumber: string;

  @Expose()
  rangeTraveled: number;

  @Expose()
  status: number;

  @Expose()
  parentStatus: number;
}
