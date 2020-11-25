import { IBox } from './box';
import { IEmployee } from './employee';
import { ITruck } from './truck';

export interface ITravel {
  id?: any;
  operator: Partial<IEmployee>;
  box: Partial<IBox>;
  truck: Partial<ITruck>;
  // GeoJson type
  locations: {
    origin: { type: 'Point', coordinates: number[] },
    destination: { type: 'Point', coordinates: number[] },
  };
  times: {
    loading: Date;
    unloading: Date;
    originArrive: Date;
    destinationArrive: Date;
  };
  comments: string;
}
