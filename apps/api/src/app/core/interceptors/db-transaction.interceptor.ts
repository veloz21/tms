import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { from, Observable } from 'rxjs';
import { catchError, mapTo, switchMap, tap } from 'rxjs/operators';

@Injectable()
export class DbTransactionInterceptor implements NestInterceptor {

  constructor(
    @InjectConnection() private connection: Connection
  ) { }

  async intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Promise<Observable<any>> {

    // Crea una sessión temporal a la que se pueda hacer rollback
    // y la guarda para acceder a ella desde un decorador
    const session = await this.connection.startSession();
    const request = context.switchToHttp().getRequest();
    request.dbSession = session;

    // Realiza la petición, si todo salió bien hace commit
    // Sino, hace rollback
    return next.handle().pipe(
      switchMap(data =>
        from(
          session.inTransaction()
            ? session.commitTransaction()
            : Promise.resolve()
        ).pipe(mapTo(data))
      ),
      tap(() => session.inTransaction() && session.endSession()),
      catchError(async err => {
        if (session.inTransaction()) {
          await session.abortTransaction();
          session.endSession();
        }

        throw err;
      })
    );
  }
}