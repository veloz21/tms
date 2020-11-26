import { IQueryParams } from '@bits404/api-interfaces';
import { IsEnum, IsNumberString } from 'class-validator';

enum SortOrder {
  'asc',
  'desc',
}

export class QueryParamsDto<T> implements IQueryParams {

  // @IsObject()
  filter: { [key: string]: string; };

  @IsEnum(SortOrder, {
    message: 'The sortOrder must be either "asc" or "desc"'
  })
  sortOrder: string;

  sortField: string;

  @IsNumberString()
  pageNumber: number;

  @IsNumberString()
  pageSize: number;
}
