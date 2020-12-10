import { IBox, IEmployee, IMaintenance, ITruck } from '@bits404/api-interfaces';

export class MaintenanceModel implements IMaintenance {
  id: string;
  truck: Partial<ITruck>;
  box: Partial<IBox>;
  mechanic: Partial<IEmployee>;
  reasons: string;
  comments: string;
  cost: number;
  times: {
    start: Date;
    end: Date;
  };

  constructor(maintenance?: Partial<IMaintenance>) {
    this.truck = (maintenance && maintenance.truck) || null;
    this.box = (maintenance && maintenance.box) || null;
    this.mechanic = (maintenance && maintenance.mechanic) || null;
    this.comments = (maintenance && maintenance.comments) || '';
    this.reasons = (maintenance && maintenance.reasons) || '';
    this.cost = maintenance && maintenance.cost || null;
    this.times = (maintenance && maintenance.times) || {
      start: new Date(),
      end: null,
    };
  }
}
