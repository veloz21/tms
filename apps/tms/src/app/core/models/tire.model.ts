import { ITire } from '@bits404/api-interfaces';

export class TireModel implements ITire {
  id: string;
  boxId?: string;
  truckId?: string;
  serialNumber: string;
  rangeTraveled: number;
  status: number;
  parentStatus: number;

  constructor(tire?: Partial<ITire>) {
    if (!tire) {
      return;
    }

    this.boxId = tire.boxId || undefined;
    this.truckId = tire.truckId || undefined;
    this.serialNumber = tire.serialNumber || '';
    this.rangeTraveled = tire.rangeTraveled || null;
    this.status = tire.status;
    this.parentStatus = tire.parentStatus;
  }
}







