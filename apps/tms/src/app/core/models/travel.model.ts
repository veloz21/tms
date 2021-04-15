import { IBox, IEmployee, IExpense, ITravel, ITruck } from '@bits404/api-interfaces';

export class TravelModel implements ITravel {
  id: string;
  operator: Partial<IEmployee>;
  box: Partial<IBox>;
  truck: Partial<ITruck>;
  locations: {
    origin: {
      type: 'Point';
      coordinates: number[];
    };
    destination: {
      type: 'Point';
      coordinates: number[];
    };
  };
  times: {
    loading: Date;
    unloading: Date;
    originArrive: Date;
    destinationArrive: Date;
  };
  comments: string;
  expenses: IExpense[];

  constructor(travel?: Partial<ITravel>) {
    this.operator = (travel && travel.operator) || null;
    this.box = (travel && travel.box) || null;
    this.truck = (travel && travel.truck) || null;
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
    this.times = (travel && travel.times) || {
      loading: new Date(),
      unloading: new Date(),
      originArrive: new Date(),
      destinationArrive: new Date(),
    };
    this.comments = (travel && travel.comments) || '';
    this.expenses = (travel && travel.expenses) || [];
  }
}
