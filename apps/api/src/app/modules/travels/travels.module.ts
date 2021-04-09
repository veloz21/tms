import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BoxesModule } from '../workshop/boxes';
import { TrucksModule } from '../workshop/trucks';
import { CompletedTravelsModule } from './completed-travels/completed-travels.module';
import { TravelStatus, TravelStatusSchema } from './schemas/travel-status.schema';
import { Travel, TravelSchema } from './schemas/travel.schema';
import { TravelsController } from './travels.controller';
import { TravelsService } from './travels.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Travel.name, schema: TravelSchema },
      { name: TravelStatus.name, schema: TravelStatusSchema },
    ]),
    BoxesModule,
    TrucksModule,
    CompletedTravelsModule,
  ],
  controllers: [TravelsController],
  providers: [TravelsService],
  exports: [TravelsService],
})
export class TravelsModule { }
