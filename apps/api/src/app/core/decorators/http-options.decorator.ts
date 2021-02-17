import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import * as mongoose from 'mongoose';
import type { HttpOptions } from '../interfaces/http-options.interface';

/**
 * Obtiene la sessión definida en DbTransactionInterceptor
 * Obtiene la compañía obtenida del token
 */
export const GetHttpOptions = createParamDecorator(
  (data: string, ctx: ExecutionContext): HttpOptions => {
    console.log('GetHttpOptions');
    const request = ctx.switchToHttp().getRequest();
    console.log('request.user', request.user);
    const company = (request.user && request.user.company) || null;
    console.log('company', company);
    const httpOptions: HttpOptions = {
      company: company ? new mongoose.Types.ObjectId(company) : null,
      session: request.dbSession || null,
    };
    return data ? httpOptions?.[data] : httpOptions;
  }
);
