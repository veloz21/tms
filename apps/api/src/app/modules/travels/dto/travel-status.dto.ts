import { ITravelStatus, Status } from '@bits404/api-interfaces';
import { Optional } from '@nestjs/common';
import { Exclude, Expose, Type } from "class-transformer";
import { BaseDBObject } from '../../../core/dto/base-db-object';

@Exclude()
class RelatedStatusDto {

  @Expose()
  @Optional()
  box: number & Status;

  @Expose()
  @Optional()
  truck: number & Status;

  @Expose()
  @Optional()
  employee: number & Status;
}

@Exclude()
export class TravelStatusDto extends BaseDBObject implements ITravelStatus {

  @Expose()
  date: Date;

  @Expose()
  name: string;

  @Expose()
  comments: string;

  @Expose()
  @Optional()
  @Type(() => RelatedStatusDto)
  relatedStatus: RelatedStatusDto;
}