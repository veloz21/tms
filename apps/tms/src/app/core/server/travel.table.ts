import { Status } from '@bits404/api-interfaces';
import { BoxModel, EmployeeModel, TruckModel } from '@tms/core/models';

export class TravelTable {
  public static travel: any[] = [
    {
      id: 1,
      operator: new EmployeeModel({
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
      box: new BoxModel({
        id: 1,
        boxModel: 'DT-123',
        type: 'Seca',
        rangeTraveled: 1000,
        serialNumber: '12345',
        brand: 'brand1',
        status: Status.AVAILABLE
      }),
      truck: new TruckModel({
        id: 1,
        truckModel: '123V123',
        brand: 'Volvo',
        serialNumber: '123',
        motorNumber: "12465",
        maintenancePeriod: '11',
        initialRange: 123,
        rangeTraveled: 200,
        circulationCard: '1',
        airbag: '1',
        dock: '1',
        status: Status.AVAILABLE
      }),
      locations: {
        origin: {
          type: 'Point',
          coordinates: [123]
        },
        destination: {
          type: 'Point',
          coordinates: [123]
        },
      },
      times: {
        loading: new Date(),
        unloading: new Date(),
        originArrive: new Date(),
        destinationArrive: new Date(),
      },
      comments: 'No se que pedo',
    },
    {
      id: 2,
      operator: new EmployeeModel({
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
      box: new BoxModel({
        id: 1,
        boxModel: 'DT-123',
        type: 'Seca',
        rangeTraveled: 1000,
        serialNumber: '12345',
        brand: 'brand1',
        status: Status.AVAILABLE
      }),
      truck: new TruckModel({
        id: 1,
        truckModel: '123V123',
        brand: 'Volvo',
        serialNumber: '123',
        motorNumber: "12465",
        maintenancePeriod: '11',
        initialRange: 123,
        rangeTraveled: 200,
        circulationCard: '1',
        airbag: '1',
        dock: '1',
        status: Status.AVAILABLE
      }),
      locations: {
        origin: {
          type: 'Point',
          coordinates: [123, 23]
        },
        destination: {
          type: 'Point',
          coordinates: [123]
        },
      },
      times: {
        loading: new Date(),
        unloading: new Date(),
        originArrive: new Date(),
        destinationArrive: new Date(),
      },
      comments: 'No se que pedo',
    },
  ];
}
