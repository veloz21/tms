import { Box, Employee, Maintenance, Truck } from '@interfaces';

export class MaintenanceModel implements Maintenance {
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

  constructor(maintenance ?: Partial < Maintenance >) {
    this.truck = maintenance && maintenance.truck || null;
    this.box = maintenance && maintenance.box || null;
    this.mechanic = maintenance && maintenance.mechanic || null;
    this.comments = maintenance && maintenance.comments || '';
    this.reasons = maintenance && maintenance.reasons || '';
    this.times = maintenance &&  maintenance.times || {
      start: new Date(),
      end: new Date()
    };
  }
}
