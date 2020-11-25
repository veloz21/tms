export interface Employee {
  id: number;
  company: string;
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
}
