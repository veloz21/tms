import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Tire, TireSchema } from './schemas/tire.schema';
import { TiresController } from './tires.controller';
import { TiresService } from './tires.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Tire.name, schema: TireSchema }]),
  ],
  controllers: [TiresController],
  providers: [TiresService]
})
export class TiresModule { }
