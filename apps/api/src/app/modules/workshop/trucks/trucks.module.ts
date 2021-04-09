import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TravelStatus, TravelStatusSchema } from '../../travels/schemas/travel-status.schema';
import { Truck, TruckSchema } from './schemas/truck.schema';
import { TrucksController } from './trucks.controller';
import { TrucksService } from './trucks.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Truck.name, schema: TruckSchema },
      { name: TravelStatus.name, schema: TravelStatusSchema },
    ]),
  ],
  controllers: [TrucksController],
  providers: [TrucksService],
  exports: [TrucksService],
})
export class TrucksModule { }
