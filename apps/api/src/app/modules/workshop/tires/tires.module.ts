import { MiddlewareConsumer, Module } from '@nestjs/common';
import { CompanyMiddleware } from '../../../core/middlewares';
import { TiresController } from './tires.controller';
import { TiresService } from './tires.service';

@Module({
  controllers: [TiresController],
  providers: [TiresService]
})
export class TiresModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CompanyMiddleware)
      .forRoutes(TiresController);
  }
}
