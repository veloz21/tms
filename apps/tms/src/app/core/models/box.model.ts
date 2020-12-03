import { IBox, ITire } from '@bits404/api-interfaces';
import { AVIABILITY_STATUS } from '@tms/enums';

export class BoxModel implements IBox {
  id: string;
  boxModel: string;
  nickname: string;
  type: string;
  rangeTraveled: number;
  serialNumber: string;
  brand: string;
  price: number;
  status: number;
  imagePath: string;
  tires: ITire[];

  constructor(box?: Partial<IBox>) {
    this.boxModel = box && box.boxModel || '';
    this.nickname = box && box.nickname || '';
    this.type = box && box.type || '';
    this.rangeTraveled = box && box.rangeTraveled || null;
    this.serialNumber = box && box.serialNumber || '';
    this.brand = box && box.brand || '';
    this.price = box && box.price || null;
    this.status = box && box.status || AVIABILITY_STATUS.AVAILABLE;
    this.imagePath = box && box.imagePath || '';
    this.tires = box && box.tires || [];
  }
}







