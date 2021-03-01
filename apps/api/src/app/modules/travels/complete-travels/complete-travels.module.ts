import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CompleteTravelsController } from './complete-travels.controller';
import { CompleteTravelsService } from './complete-travels.service';
import { CompleteTravel, completeTravelSchema } from './schemas/completed_travel.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: CompleteTravel.name, schema: completeTravelSchema }])],
  controllers: [CompleteTravelsController],
  providers: [CompleteTravelsService],
})
export class CompleteTravelsModule {}
