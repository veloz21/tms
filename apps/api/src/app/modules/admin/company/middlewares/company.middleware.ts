import { Injectable, NestMiddleware } from '@nestjs/common';
import { CompanyService } from '../company.service';

@Injectable()
export class CompanyMiddleware implements NestMiddleware {

  constructor(
    private companyService: CompanyService,
  ) { }

  use(req: any, res: any, next: () => void) {
    const { company } = req.headers;
    if (!company) {
      return
    }
    console.log(req.headers);
    next();
  }
}
