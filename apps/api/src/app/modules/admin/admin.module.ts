import { Module } from '@nestjs/common';
import { CompanyModule } from './company/company.module';
import { EmployeesModule } from './employees/employees.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [EmployeesModule, UsersModule, CompanyModule]
})
export class AdminModule { }
