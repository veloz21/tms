import { Box } from './box.interface';
import { Employee } from './employee.interface';
import { Truck } from './truck.interface';

export interface Travel {
  id: number;
  operator: Employee;
  box: Box;
  truck: Truck;
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
