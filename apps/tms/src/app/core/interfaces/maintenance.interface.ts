import { Box } from './box.interface';
import { Employee } from './employee.interface';
import { Truck } from './truck.interface';

export interface Maintenance {
  id: number;
  companny: string;
  truck: Truck;
  box: Box;
  mechanic: Employee;
  reasons: string;
  comments: string;
  times: {
    start: Date,
    end: Date
  };
}
