import { Routes } from 'nest-router';
import { AdminModule } from './modules/admin';
import { AuthModule } from './modules/auth';
import { TravelsModule } from './modules/travels';
import { WorkshopModule } from './modules/workshop';

export const routes: Routes = [
  {
    path: '/auth',
    module: AuthModule,
  },
  {
    path: ':tenant_id',
    childrens: [
      {
        path: 'admin',
        module: AdminModule,
      },
      {
        path: 'travels',
        module: TravelsModule,
      },
      {
        path: 'workshop',
        module: WorkshopModule,
      },
    ]
  },
];