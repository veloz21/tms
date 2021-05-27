import { Status } from './status.enum';

export interface ITire {
  id?: any;
  boxId?: any;
  truckId?: any;
  serialNumber: string;
  brand: string;
  initialRange: number;
  rangeTraveled: number;
  status: number & Status;
  parentStatus: number & Status;
}
