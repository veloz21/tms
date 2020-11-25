import { Injectable, NestMiddleware } from '@nestjs/common';
import { AuthService } from '../../modules/auth/auth.service';

@Injectable()
export class CompanyMiddleware implements NestMiddleware {

  constructor(private authService: AuthService){}

  use(req: any, res: any, next: () => void) {
    const { company } = req.headers;
    if(!company) {
      return 
    }
    console.log(req.headers);
    next();
  }
}
