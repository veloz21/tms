import { AVIABILITY_STATUS } from '@tms/core/enums';

export class TruckTable {
  public static trucks: any[] = [
    {
      id: 1,
      truckModel: '123V123',
      brand: 'Volvo',
      serialNumber: '123',
      motorNumber: 12465,
      maintenancePeriod: '11',
      initialRange: 123,
      rangeTraveled: 200,
      circulationCard: '1',
      airbag: '1',
      dock: '1',
      status: AVIABILITY_STATUS.AVAILABLE
    },
    {
      id: 2,
      truckModel: '123',
      brand: 'Volvo',
      serialNumber: '12309870',
      motorNumber: 124650000,
      maintenancePeriod: '10',
      initialRange: 1230,
      rangeTraveled: 200,
      circulationCard: '1',
      airbag: '1',
      dock: '1',
      status: AVIABILITY_STATUS.NOT_AVAILABLE
    }
  ];
}
