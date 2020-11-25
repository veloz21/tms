import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MaintenancesController } from './maintenances.controller';
import { MaintenancesService } from './maintenances.service';
import { Maintenance, MaintenanceSchema } from './schemas/maintenance.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Maintenance.name, schema: MaintenanceSchema }]),
  ],
  controllers: [MaintenancesController],
  providers: [MaintenancesService]
})
export class MaintenancesModule { }
