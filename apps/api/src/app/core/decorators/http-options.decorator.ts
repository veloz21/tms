import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import * as mongoose from 'mongoose';
import { HttpOptions } from '../interfaces/http-options.interface';

/**
 * Obtiene la sessión definida en DbTransactionInterceptor
 * Obtiene la compañía obtenida del token
 */
export const GetHttpOptions = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): HttpOptions => {
    const request = ctx.switchToHttp().getRequest();
    const company = request.user && request.user.company || null;
    return {
      company: company ? new mongoose.Types.ObjectId(company) : null,
      session: request.dbSession || null,
    }
  },
);