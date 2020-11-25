import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RouterModule } from 'nest-router';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CompanyMiddleware } from './core/middlewares';
import { AdminModule } from './modules/admin';
import { AuthModule } from './modules/auth';
import { TravelsModule } from './modules/travels';
import { WorkshopModule } from './modules/workshop';
import { routes } from './routes';

@Module({
  imports: [
    AuthModule,
    AdminModule,
    TravelsModule,
    WorkshopModule,
    RouterModule.forRoutes(routes),
    MongooseModule.forRoot('mongodb://localhost/tms-nx'),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    // consumer
    //   .apply(CompanyMiddleware)
    //   .forRoutes('(.*)')
    consumer
      .apply(CompanyMiddleware)
      .forRoutes({ path: '/**', method: RequestMethod.ALL });
  }
}
