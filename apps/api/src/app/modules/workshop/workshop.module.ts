import { Module } from '@nestjs/common';
import { RouterModule } from 'nest-router';
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
    // CompanyModule,
    RouterModule.forRoutes(workshopRoutes),
  ],
  providers: []
})
export class WorkshopModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer
  //     .apply(CompanyMiddleware)
  //     .forRoutes({ path: '/**', method: RequestMethod.ALL });
  // }
}
