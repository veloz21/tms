import { Injectable } from '@nestjs/common';

@Injectable()
export class CompanyService {

  _company: string;
  get company(): string {
    return this._company;
  }

  set company(company: string) {
    this._company = company;
  }
}
