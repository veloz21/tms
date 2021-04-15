import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Travel, TravelSchema } from './schemas/travel.schema';
import { TravelsController } from './travels.controller';
import { TravelsService } from './travels.service';
import { CompleteTravelsModule } from './complete-travels/complete-travels.module';
import { ExpensesModule } from './expenses/expenses.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Travel.name, schema: TravelSchema }]),
    CompleteTravelsModule,
    ExpensesModule,
  ],
  controllers: [TravelsController],
  providers: [TravelsService]
})
export class TravelsModule { }
