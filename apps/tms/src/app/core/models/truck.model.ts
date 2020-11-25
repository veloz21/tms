import { AVIABILITY_STATUS } from '@enums';
import { Truck } from '@interfaces';

export class TruckModel implements Truck {
  id: number;
  company: string;
  truckModel: string;
  brand: string;
  serialNumber: string;
  motorNumber: number;
  maintenancePeriod: string;
  initialRange: number;
  rangeTraveled: number;
  circulationCard: string;
  airbag: string;
  dock: string;
  status: number;

  constructor(truck?: Partial<Truck>) {
    this.truckModel = truck && truck.truckModel || '';
    this.brand = truck && truck.brand || '';
    this.serialNumber = truck && truck.serialNumber || '';
    this.motorNumber = truck && truck.motorNumber || null;
    this.maintenancePeriod = truck && truck.maintenancePeriod || '';
    this.initialRange = truck && truck.initialRange || null;
    this.rangeTraveled = truck && truck.rangeTraveled || null;
    this.circulationCard = truck && truck.circulationCard || '';
    this.airbag = truck && truck.airbag || '';
    this.dock = truck && truck.dock || '';
    this.status = truck && truck.status || AVIABILITY_STATUS.AVAILABLE;
  }
}
