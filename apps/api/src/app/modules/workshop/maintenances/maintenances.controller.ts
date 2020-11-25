import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CreateMaintenanceDto } from './dto/create-maintenance.dto';
import { UpdateMaintenanceDto } from './dto/update-maintenance.dto';
import { MaintenancesService } from './maintenances.service';

@Controller('')
export class MaintenancesController {
  constructor(private readonly maintenancesService: MaintenancesService) { }

  @Post()
  create(@Body() createMaintenanceDto: CreateMaintenanceDto) {
    return this.maintenancesService.create(createMaintenanceDto);
  }

  @Get()
  findAll() {
    return this.maintenancesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.maintenancesService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateMaintenanceDto: UpdateMaintenanceDto) {
    return this.maintenancesService.update(+id, updateMaintenanceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.maintenancesService.remove(+id);
  }
}
