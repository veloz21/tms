import { IExpense } from '@bits404/api-interfaces';

export class ExpenseModel implements IExpense {
  id?: string;
  name: string;
  price: number;

  constructor(expense?: Partial<IExpense>) {
    this.name = (expense && expense.name) || '';
    this.price = (expense && expense.price) || null;
  }
}
