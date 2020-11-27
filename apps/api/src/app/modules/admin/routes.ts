import { Routes } from 'nest-router';
import { CompanyModule } from './company';
import { EmployeesModule } from './employees';
import { UsersModule } from './users';

export const adminRoutes: Routes = [
  {
    path: 'admin',
    childrens: [
      {
        path: 'company',
        module: CompanyModule,
      },
      {
        path: 'employees',
        module: EmployeesModule,
      },
      {
        path: 'users',
        module: UsersModule,
      },
    ]
  },
];