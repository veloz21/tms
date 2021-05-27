import { ITire } from '@bits404/api-interfaces';
import { Exclude, Expose } from 'class-transformer';
import { BaseDBObject } from '../../../../core/dto/base-db-object';

@Exclude()
export class SubdocumentTireDto extends BaseDBObject implements ITire {
  @Expose()
  serialNumber: string;

  @Expose()
  brand: string;

  @Expose()
  initialRange: number;

  @Expose()
  rangeTraveled: number;

  status: number;
  parentStatus: number;
}
