import { Company } from '../_interfaces/company.interface';

export class CompanyModel implements Company {
  id: string;
  email: string;
  password: string;

  constructor( user?: Partial<Company>) {
    this.email = user && user.email || '';
    this.password = user && user.password || '';
  }
}
