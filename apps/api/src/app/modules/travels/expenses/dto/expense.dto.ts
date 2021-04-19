import { IExpense } from '@bits404/api-interfaces';
import { Exclude, Expose } from "class-transformer";
import { BaseDBObject } from '../../../../core/dto/base-db-object';

@Exclude()
export class ExpenseDto extends BaseDBObject implements IExpense {

  @Expose()
  name: string;

  @Expose()
  price: number;
}