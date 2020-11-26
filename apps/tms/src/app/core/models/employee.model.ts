import { IEmployee } from '@bits404/api-interfaces';

export class EmployeeModel implements IEmployee {
  id: string;
  firstName: string;
  lastName: string;
  cellphone: string;
  secondaryCellphone: string;
  address: string;
  birthDate: Date;
  admissionDate: Date;
  salary: {
    currency: string,
    total: number,
  };
  documents: {
    driversLicense: {
      type: string,
      dueDate: Date,
      attachmentPath: string,
    },
    phychophysicistTest: {
      date: Date,
      expirationDate: Date,
      attachmentPath: string,
    },
    ine: {
      attachmentPath: string[],
    },
  };
  imagePath: string;
  status: number;

  constructor(employee?: Partial<IEmployee>) {
    this.firstName = employee && employee.firstName || '';
    this.lastName = employee && employee.lastName || '';
    this.cellphone = employee && employee.cellphone || '';
    this.secondaryCellphone = employee && employee.secondaryCellphone || '';
    this.address = employee && employee.address || '';
    this.birthDate = employee && employee.birthDate || null;
    this.admissionDate = employee && employee.admissionDate || null;
    this.salary = employee && employee.salary || {
      currency: 'MXN',
      total: null
    };
    this.documents = employee && employee.documents || {
      driversLicense: {
        type: '',
        dueDate: null,
        attachmentPath: ''
      },
      phychophysicistTest: {
        date: null,
        expirationDate: null,
        attachmentPath: ''
      },
      ine: {
        attachmentPath: []
      }
    };
    this.imagePath = employee && employee.imagePath || '';
    this.status = employee && employee.status || null;
  }
}

