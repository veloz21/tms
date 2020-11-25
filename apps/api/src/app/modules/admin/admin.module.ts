import { Module } from '@nestjs/common';
import { EmployeesModule } from './employees/employees.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [EmployeesModule, UsersModule]
})
export class AdminModule {}
