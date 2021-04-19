import { IBox } from './box';
import { IEmployee } from './employee';
import { IExpense } from './expense';
import { ITravelStatus } from './travel-status';
import { ITruck } from './truck';

export interface ITravel {
  id?: any;
  operator: Partial<IEmployee>;
  box: Partial<IBox>;
  truck: Partial<ITruck>;
  salePrice: number;
  // GeoJson type
  locations: {
    origin: { type: 'Point', coordinates: number[] },
    destination: { type: 'Point', coordinates: number[] },
  };
  status: Partial<ITravelStatus>[];
  currentStatus: any;
  comments: string;
  expenses: Partial<IExpense>[];
}
