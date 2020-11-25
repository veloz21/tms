import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Travel, TravelSchema } from './schemas/travel.schema';
import { TravelsController } from './travels.controller';
import { TravelsService } from './travels.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Travel.name, schema: TravelSchema }]),
  ],
  controllers: [TravelsController],
  providers: [TravelsService]
})
export class TravelsModule { }
