import { IBox } from './box';
import { IEmployee } from './employee';
import { ITruck } from './truck';

export interface IMaintenance {
  id?: any;
  truck: Partial<ITruck>,
  box: Partial<IBox>,
  mechanic: Partial<IEmployee>,
  reasons: string,
  comments: string,
  price: number;
  times: {
    start: Date,
    end: Date,
  },
}
