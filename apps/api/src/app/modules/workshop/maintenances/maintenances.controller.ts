import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { CreateMaintenanceDto } from './dto/create-maintenance.dto';
import { UpdateMaintenanceDto } from './dto/update-maintenance.dto';
import { MaintenancesService } from './maintenances.service';

@Controller('')
export class MaintenancesController {
  constructor(private readonly maintenancesService: MaintenancesService) { }

  @Post()
  async create(@Body() createMaintenanceDto: CreateMaintenanceDto) {
    try {
      return await this.maintenancesService.create(createMaintenanceDto);
    } catch (error) {
      throw new HttpException(error && error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  async findAll() {
    try {
      return await this.maintenancesService.findAll();
    } catch (error) {
      throw new HttpException(error && error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.maintenancesService.findOne(id);
    } catch (error) {
      throw new HttpException(error && error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateMaintenanceDto: UpdateMaintenanceDto) {
    try {
      return await this.maintenancesService.update(id, updateMaintenanceDto);
    } catch (error) {
      throw new HttpException(error && error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return await this.maintenancesService.remove(id);
    } catch (error) {
      throw new HttpException(error && error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
