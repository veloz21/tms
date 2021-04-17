import { Status } from "./status.enum";

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
  salary: number;
  documents: {
    driversLicense: {
      type: string,
      dueDate: Date,
      attachmentPath: string,
    },
    psychophysicistTest: {
      date: Date,
      expirationDate: Date,
      attachmentPath: string,
    },
    ine: {
      attachmentPath: string[],
    },
  };
  imagePath: string;
  status: number & Status;
}
