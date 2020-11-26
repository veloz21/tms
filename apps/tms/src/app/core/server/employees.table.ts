import { AVIABILITY_STATUS } from '@tms/enums';

export class EmployeeTable {
  public static employees: any[] = [
    {
      id: 1,
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
