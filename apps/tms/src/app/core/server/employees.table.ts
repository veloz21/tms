import { AVIABILITY_STATUS } from '@enums';

export class EmployeeTable {
  public static employees: any[] = [
    {
      id: 1,
      company: 'Galmex',
      firstName: 'Ernesto',
      lastName: 'Lozano',
      cellphone: '4493134435',
      secondaryCellphone: '4493134436',
      address: 'Av. Universidad',
      birthDate: new Date(),
      admissionDate: new Date(),
      salary: {
        currency: 'MXN',
        total: 7500,
      },
      documents: {
        driversLicense: {
          type: 'E',
          dueDate: new Date(),
          attachmentPath: '/HOLA',
        },
        phychophysicistTest: {
          date: new Date(),
          expirationDate: new Date(),
          attachmentPath: '/HOA',
        },
        ine: {
          attachmentPath: [''],
        },
      },
      imagePath: '',
      status: AVIABILITY_STATUS.AVAILABLE,
    },
    {
      id: 2,
      company: 'Galmex',
      firstName: 'Juan',
      lastName: 'Perez',
      cellphone: '4493134435',
      secondaryCellphone: '4493134436',
      address: 'Av. Universidad',
      birthDate: new Date(),
      admissionDate: new Date(),
      salary: {
        currency: 'MXN',
        total: 7500,
      },
      documents: {
        driversLicense: {
          type: 'E',
          dueDate: new Date(),
          attachmentPath: '/HOLA',
        },
        phychophysicistTest: {
          date: new Date(),
          expirationDate: new Date(),
          attachmentPath: '/HOA',
        },
        ine: {
          attachmentPath: [''],
        },
      },
      imagePath: '',
      status: AVIABILITY_STATUS.NOT_AVAILABLE,
    },
  ];
}
