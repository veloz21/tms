import { Status } from './status.enum';
import { ITire } from './tire';

export interface ITruck {
  id?: any;
  truckModel: string;
  brand: string;
  nickname: string;
  serialNumber: string;
  motorNumber: string;
  maintenancePeriod: string;
  initialRange: number;
  rangeTraveled: number;
  circulationCard: string;
  price: number;
  airbag: string;
  dock: string;
  status: number & Status;
  imagePath: string;
  tires: Partial<ITire>[];
}
