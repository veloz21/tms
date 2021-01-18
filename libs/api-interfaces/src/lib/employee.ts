export interface IEmployee {
  id?: any;
  firstName: string;
  lastName: string;
  cellphone: string;
  address: string;
  birthDate: Date;
  type: string;
  admissionDate: Date;
  secondaryCellphone: string;
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
