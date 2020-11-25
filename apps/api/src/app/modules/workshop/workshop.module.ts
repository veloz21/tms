import { MiddlewareConsumer, Module } from '@nestjs/common';
import { RouterModule } from 'nest-router';
import { CompanyMiddleware } from '../../core/middlewares';
import { BoxesModule } from './boxes/boxes.module';
import { MaintenancesModule } from './maintenances/maintenances.module';
import { workshopRoutes } from './routes';
import { TiresModule } from './tires/tires.module';
import { TrucksModule } from './trucks/trucks.module';

@Module({
  imports: [
    BoxesModule,
    MaintenancesModule,
    TiresModule,
    TrucksModule,
    RouterModule.forRoutes(workshopRoutes),
  ]
})
export class WorkshopModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CompanyMiddleware)
      .forRoutes('(.*)');
  }
}
