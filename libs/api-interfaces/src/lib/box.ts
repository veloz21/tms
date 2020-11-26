import { ITire } from './tire';

export interface IBox {
  id?: any;
  boxModel: string;
  type: string;
  rangeTraveled: number;
  serialNumber: string;
  brand: string;
  status: number;
  tires: ITire[];
}
