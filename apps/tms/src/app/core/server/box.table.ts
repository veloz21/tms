import { AVIABILITY_STATUS } from '@tms/enums';

export class BoxTable {
  public static boxes: any = [{
    id: 1,
    boxModel: 'DT-123',
    type: 'Seca',
    rangeTraveled: 1000,
    serialNumber: '12345',
    brand: 'brand1',
    status: AVIABILITY_STATUS.AVAILABLE
  },
  {
    id: 2,
    boxModel: 'DT-124',
    type: 'Seca',
    rangeTraveled: 2000,
    serialNumber: '54321',
    brand: 'brand2',
    status: AVIABILITY_STATUS.NOT_AVAILABLE
  },
  {
    id: 3,
    boxModel: 'DT-124',
    type: 'Seca',
    rangeTraveled: 2000,
    serialNumber: '54321',
    brand: 'brand2',
    status: AVIABILITY_STATUS.IN_MAINTENANCE
  },
  ];
}

