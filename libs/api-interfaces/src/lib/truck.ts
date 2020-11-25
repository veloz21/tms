import { ITire } from './tire';

export interface ITruck {
  id?: any;
  truckModel: string;
  brand: string;
  serialNumber: string;
  motorNumber: string;
  maintenancePeriod: string;
  initialRange: number;
  rangeTraveled: number;
  circulationCard: string;
  airbag: string;
  dock: string;
  tires: ITire[];
}
