import { ITire } from './tire';

export interface IBox {
  id?: any;
  boxModel: string;
  type: string;
  rangeTraveled: number;
  nickname: string;
  serialNumber: string;
  brand: string;
  price: number;
  status: number;
  imagePath: string;
  tires: ITire[];
}
