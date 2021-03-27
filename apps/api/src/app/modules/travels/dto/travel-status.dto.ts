import { ITravelStatus } from '@bits404/api-interfaces';
import { Exclude, Expose } from "class-transformer";
import { BaseDBObject } from '../../../core/dto/base-db-object';

@Exclude()
export class TravelStatusDto extends BaseDBObject implements ITravelStatus {

  @Expose()
  date: Date;

  @Expose()
  name: string;

  @Expose()
  comments: string;

  order: number;
}