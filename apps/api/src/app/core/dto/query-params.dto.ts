import { IQueryParams } from '@bits404/api-interfaces';
import { Transform } from 'class-transformer';
import { IsEnum, IsInt } from 'class-validator';

enum SortOrder {
  'asc',
  'desc',
}

export class QueryParamsDto<T> implements IQueryParams {
  // @IsArray()
  @Transform((val) => (typeof val === 'string' ? JSON.parse(val) : val), { toClassOnly: true })
  filter: {};

  @IsEnum(SortOrder, {
    message: 'The sortOrder must be either "asc" or "desc"',
  })
  sortOrder: string;

  sortField: string;

  @IsInt()
  @Transform((val) => Number.parseInt(val, 10))
  pageNumber: number;

  @IsInt()
  @Transform((val) => Number.parseInt(val, 10))
  pageSize: number;
}
