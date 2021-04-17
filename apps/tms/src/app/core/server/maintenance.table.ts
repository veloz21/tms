import { Status } from '@bits404/api-interfaces';
import { BoxModel, EmployeeModel, TruckModel } from '@tms/core/models';

export class MaintenanceTable {
  public static maintenances: any[] = [
    {
      id: 1,
      companny: 'Galmex',
      truck: new TruckModel({
        id: 2,
        truckModel: '123',
        brand: 'Volvo',
        serialNumber: '12309870',
        motorNumber: '124650000',
        maintenancePeriod: '10',
        initialRange: 1230,
        rangeTraveled: 200,
        circulationCard: '1',
        airbag: '1',
        dock: '1',
        status: Status.NOT_AVAILABLE
      }),
      box: new BoxModel(),
      mechanic: new EmployeeModel({
        id: 1,
        firstName: 'Ernesto',
        lastName: 'Lozano',
        cellphone: '4493134435',
        secondaryCellphone: '4493134436',
        address: 'Av. Universidad',
        birthDate: new Date(),
        admissionDate: new Date(),
        salary: 7500,
        documents: {
          driversLicense: {
            type: 'E',
            dueDate: new Date(),
            attachmentPath: '/HOLA',
          },
          psychophysicistTest: {
            date: new Date(),
            expirationDate: new Date(),
            attachmentPath: '/HOA',
          },
          ine: {
            attachmentPath: [''],
          },
        },
        imagePath: '',
        status: Status.AVAILABLE,
      }),
      reasons: 'Hola',
      comments: 'Adios',
      times: {
        start: new Date(),
        end: new Date()
      },
    }
  ];
}


