import { Module } from '@nestjs/common';
import { RouterModule } from 'nest-router';
import { CompanyModule } from './company/company.module';
import { EmployeesModule } from './employees/employees.module';
import { adminRoutes } from './routes';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    EmployeesModule,
    UsersModule,
    CompanyModule,
    RouterModule.forRoutes(adminRoutes),
  ]
})
export class AdminModule { }
