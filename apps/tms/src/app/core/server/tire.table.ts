import { AVIABILITY_STATUS } from '@enums';

export class TireTable {
  public static tires: any = [{
      id: 1,
      company: 'Galmex',
      serialNumber: '1001',
      rangeTraveled: 123,
      status: AVIABILITY_STATUS.AVAILABLE
    },
    {
      id: 2,
      company: 'Galmex',
      serialNumber: '1002',
      rangeTraveled: 123,
      status: AVIABILITY_STATUS.AVAILABLE
    },
  ];
}
