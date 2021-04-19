import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EmployeesModule } from '../admin/employees/employees.module';
import { BoxesModule } from '../workshop/boxes/boxes.module';
import { TrucksModule } from '../workshop/trucks/trucks.module';
import { CompletedTravelsModule } from './completed-travels/completed-travels.module';
import { ExpensesModule } from './expenses/expenses.module';
import { Expense, ExpenseSchema } from './expenses/schemas/expenses.schema';
import { TravelStatus, TravelStatusSchema } from './schemas/travel-status.schema';
import { Travel, TravelSchema } from './schemas/travel.schema';
import { TravelsController } from './travels.controller';
import { TravelsService } from './travels.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Travel.name, schema: TravelSchema },
      { name: TravelStatus.name, schema: TravelStatusSchema },
      { name: Expense.name, schema: ExpenseSchema },
    ]),
    BoxesModule,
    TrucksModule,
    ExpensesModule,
    EmployeesModule,
    CompletedTravelsModule,
  ],
  controllers: [TravelsController],
  providers: [TravelsService],
  exports: [TravelsService],
})
export class TravelsModule { }
