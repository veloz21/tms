import { IBox, ITire } from '@bits404/api-interfaces';
import { AVIABILITY_STATUS } from '@tms/enums';

export class BoxModel implements IBox {
  id: string;
  boxModel: string;
  type: string;
  rangeTraveled: number;
  serialNumber: string;
  brand: string;
  status: number;
  tires: ITire[];

  constructor(box?: Partial<IBox>) {
    this.boxModel = box && box.boxModel || '';
    this.type = box && box.type || '';
    this.rangeTraveled = box && box.rangeTraveled || null;
    this.serialNumber = box && box.serialNumber || '';
    this.brand = box && box.brand || '';
    this.status = box && box.status || AVIABILITY_STATUS.AVAILABLE;
    this.tires = box && box.tires || [];
  }
}







