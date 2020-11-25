export interface IEmployee {
  id?: string;
  firstName: string;
  lastName: string;
  cellphone: string;
  address: string;
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
}
