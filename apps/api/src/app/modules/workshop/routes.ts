import { Routes } from 'nest-router';
import { BoxesModule } from './boxes/boxes.module';
import { MaintenancesModule } from './maintenances/maintenances.module';
import { TiresModule } from './tires/tires.module';
import { TrucksModule } from './trucks/trucks.module';

export const workshopRoutes: Routes = [
  {
    path: 'workshop',
    module: BoxesModule,
    childrens: [
      {
        path: 'boxes',
        module: BoxesModule,
      },
      {
        path: 'maintenances',
        module: MaintenancesModule,
      },
      {
        path: 'tires',
        module: TiresModule,
      },
      {
        path: 'trucks',
        module: TrucksModule,
      },
    ]
  },
];

