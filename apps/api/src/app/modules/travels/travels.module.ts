import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Travel, TravelSchema } from './schemas/travel.schema';
import { TravelsController } from './travels.controller';
import { TravelsService } from './travels.service';
import { CompleteTravelsModule } from './complete-travels/complete-travels.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Travel.name, schema: TravelSchema }]),
    CompleteTravelsModule,
  ],
  controllers: [TravelsController],
  providers: [TravelsService]
})
export class TravelsModule { }
