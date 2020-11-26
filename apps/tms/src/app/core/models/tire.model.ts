import { ITire } from '@bits404/api-interfaces';
import { AVIABILITY_STATUS } from '@tms/enums';

export class TireModel implements ITire {
  id: string;
  serialNumber: string;
  rangeTraveled: number;
  status: number;

  constructor(tire?: Partial<ITire>) {
    this.serialNumber = tire && tire.serialNumber || '';
    this.rangeTraveled = tire && tire.rangeTraveled || null;
    this.status = tire && tire.status || AVIABILITY_STATUS.AVAILABLE;
  }
}







