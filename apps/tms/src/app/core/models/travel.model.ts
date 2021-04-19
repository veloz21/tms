import { IBox, IEmployee, IExpense, ITravel, ITruck } from '@bits404/api-interfaces';
import { TravelStatusModel } from './travel-status.model';

export class TravelModel implements ITravel {
  id: string;
  operator: Partial<IEmployee>;
  box: Partial<IBox>;
  truck: Partial<ITruck>;
  salePrice: number;
  locations: {
    origin: {
      type: 'Point',
      coordinates: number[],
    },
    destination: {
      type: 'Point',
      coordinates: number[],
    },
  };
  status: Partial<TravelStatusModel>[];
  currentStatus: string;
  comments: string;
  expenses: Partial<IExpense>[];

  constructor(travel?: Partial<ITravel>) {
    this.operator = (travel && travel.operator) || null;
    this.box = (travel && travel.box) || null;
    this.truck = (travel && travel.truck) || null;
    this.salePrice = (travel && travel.salePrice) || null;
    this.locations = (travel && travel.locations) || {
      origin: {
        type: 'Point',
        // lng, lat
        coordinates: [],
      },
      destination: {
        type: 'Point',
        // lng, lat
        coordinates: [],
      },
    };
    this.status = (travel && travel.status) || [];
    this.comments = (travel && travel.comments) || '';
    this.expenses = (travel && travel.expenses) || [];
  }
}
