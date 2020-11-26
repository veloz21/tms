import { AVIABILITY_STATUS } from '@tms/enums';
import { Tire } from '@tms/interfaces';

export class TireModel implements Tire {
  id: number;
  _id: string;
  company: string;
  serialNumber: string;
  rangeTraveled: number;
  status: number;

  constructor(tire?: Partial<Tire>) {
    this.serialNumber = tire && tire.serialNumber || '';
    this.rangeTraveled = tire && tire.rangeTraveled || null;
    this.status = tire && tire.status || AVIABILITY_STATUS.AVAILABLE;
  }
}







