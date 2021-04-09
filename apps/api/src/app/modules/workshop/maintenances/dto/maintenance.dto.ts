import { IMaintenance } from '@bits404/api-interfaces';
import { Exclude, Expose, Transform, Type } from "class-transformer";
import { BaseDBObject } from '../../../../core/dto/base-db-object';
import { MaintenanceBoxDto } from './maintenance-box.dto';
import { MaintenanceEmployeeDto } from './maintenance-employee.dto';
import { MaintenanceTruckDto } from './maintenance-truck.dto';

@Exclude()
export class TimesDto {

  @Expose()
  @Transform(value => value && new Date(value), { toClassOnly: true })
  start: Date;

  @Expose()
  @Transform(value => value && new Date(value), { toClassOnly: true })
  end: Date;
}

@Exclude()
export class MaintenanceDto extends BaseDBObject implements IMaintenance {

  @Expose()
  @Type(() => MaintenanceEmployeeDto)
  mechanic: MaintenanceEmployeeDto;

  @Expose()
  @Type(() => MaintenanceBoxDto)
  box: MaintenanceBoxDto;

  @Expose()
  @Type(() => MaintenanceTruckDto)
  truck: MaintenanceTruckDto;

  @Expose()
  reasons: string;

  @Expose()
  comments: string;

  @Expose()
  price: number;

  @Expose()
  times: TimesDto;
}
