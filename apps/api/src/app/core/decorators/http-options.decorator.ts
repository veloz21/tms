import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import * as mongoose from 'mongoose';
import type { HttpOptions } from '../interfaces/http-options.interface';

/**
 * Obtiene la sessión definida en DbTransactionInterceptor
 * Obtiene la compañía obtenida del token
 */
export const GetHttpOptions = createParamDecorator(
  (data: string, ctx: ExecutionContext): HttpOptions => {
    const request = ctx.switchToHttp().getRequest();
    const company = request.user && request.user.company || null;
    const httpOptions: HttpOptions = {
      company: company ? new mongoose.Types.ObjectId(company) : null,
      session: request.dbSession || null,
    };
    return data ? httpOptions?.[data] : httpOptions;
  },
);