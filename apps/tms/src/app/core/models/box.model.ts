import { AVIABILITY_STATUS } from '@tms/enums';
import { Box } from '@tms/interfaces';

export class BoxModel implements Box {
  id: number;
  company: string;
  boxModel: string;
  type: string;
  rangeTraveled: number;
  serialNumber: string;
  brand: string;
  status: number;

  constructor(box?: Partial<Box>) {
    this.boxModel = box && box.boxModel || '';
    this.type = box && box.type || '';
    this.rangeTraveled = box && box.rangeTraveled || null;
    this.serialNumber = box && box.serialNumber || '';
    this.brand = box && box.brand || '';
    this.status = box && box.status || AVIABILITY_STATUS.AVAILABLE;
  }
}







