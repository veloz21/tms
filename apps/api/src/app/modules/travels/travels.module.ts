import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CompleteTravelsModule } from './complete-travels/complete-travels.module';
import { TravelStatus, TravelStatusSchema } from './schemas/travel-status.schema';
import { Travel, TravelSchema } from './schemas/travel.schema';
import { TravelsController } from './travels.controller';
import { TravelsService } from './travels.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Travel.name, schema: TravelSchema }]),
    MongooseModule.forFeature([{ name: TravelStatus.name, schema: TravelStatusSchema }]),
    CompleteTravelsModule,
  ],
  controllers: [TravelsController],
  providers: [TravelsService],
  exports: [TravelsService],
})
export class TravelsModule { }
