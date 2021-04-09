import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { ClassType } from 'class-transformer/ClassTransformer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<Partial<T>, T> {

  constructor(private readonly classType: ClassType<T>) { }

  plainToClass(item: any) {
    return plainToClass(this.classType, item, { enableImplicitConversion: true })
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<T> {
    return next.handle().pipe(map(data => {
      if (!data) {
        return;
      }

      if (data.items !== undefined && data.totalCount !== undefined) {
        data.items = data.items.map(i => this.plainToClass(i));
        return data;
      }

      if (data && data.length > 0) {
        return data.map(d => this.plainToClass(d));
      }

      return this.plainToClass(data);
    }));
  }
}