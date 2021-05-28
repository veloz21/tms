import { IEmployee } from '@bits404/api-interfaces';

export class EmployeeModel implements IEmployee {
  id: string;
  firstName: string;
  lastName: string;
  cellphone: string;
  secondaryCellphone: string;
  address: string;
  type: string;
  birthDate: Date;
  admissionDate: Date;
  paymentFrequency: string;
  salary: number;
  documents: {
    driversLicense: {
      type: string;
      dueDate: Date;
      attachmentPath: string;
    };
    psychophysicistTest: {
      date: Date;
      expirationDate: Date;
      attachmentPath: string;
    };
    ine: {
      attachmentPath: string[];
    };
  };
  imagePath: string;
  status: number;

  constructor(employee?: Partial<IEmployee>) {
    this.firstName = (employee && employee.firstName) || '';
    this.lastName = (employee && employee.lastName) || '';
    this.cellphone = (employee && employee.cellphone) || '';
    this.secondaryCellphone = (employee && employee.secondaryCellphone) || '';
    this.address = (employee && employee.address) || '';
    this.birthDate = (employee && employee.birthDate) || null;
    this.admissionDate = (employee && employee.admissionDate) || null;
    this.paymentFrequency = (employee && employee.paymentFrequency) || '';
    this.salary = (employee && employee.salary) || null;
    this.documents = (employee && employee.documents) || {
      driversLicense: {
        type: '',
        dueDate: null,
        attachmentPath: '',
      },
      psychophysicistTest: {
        date: null,
        expirationDate: null,
        attachmentPath: '',
      },
      ine: {
        attachmentPath: [],
      },
    };
    this.imagePath = (employee && employee.imagePath) || '';
    this.status = (employee && employee.status) || null;
  }
}
