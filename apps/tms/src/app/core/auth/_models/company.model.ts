import { ICompany } from "@bits404/api-interfaces";

export class CompanyModel implements ICompany {
  id?: string;
  name: string

  constructor( user?: Partial<ICompany>) {
    this.name = user && user.name || '';
  }
}
