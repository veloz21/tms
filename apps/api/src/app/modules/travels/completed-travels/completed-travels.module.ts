import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CompletedTravelsController } from './completed-travels.controller';
import { CompletedTravelsService } from './completed-travels.service';
import { CompletedTravel, CompletedTravelSchema } from './schemas/completed-travel.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: CompletedTravel.name, schema: CompletedTravelSchema }])],
  controllers: [CompletedTravelsController],
  providers: [CompletedTravelsService],
})
export class CompletedTravelsModule { }
