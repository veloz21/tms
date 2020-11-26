import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { GetHttpOptions } from '../../../core/decorators';
import { QueryParamsDto } from '../../../core/dto';
import { DbTransactionInterceptor } from '../../../core/interceptors';
import type { HttpOptions } from '../../../core/interfaces';
import { JwtAuthGuard } from '../../auth';
import { CreateMaintenanceDto } from './dto/create-maintenance.dto';
import { UpdateMaintenanceDto } from './dto/update-maintenance.dto';
import { MaintenancesService } from './maintenances.service';

@Controller('')
@UseGuards(JwtAuthGuard)
@UseInterceptors(DbTransactionInterceptor)
export class MaintenancesController {
  constructor(private readonly maintenancesService: MaintenancesService) { }

  @Post()
  async create(@Body() createMaintenanceDto: CreateMaintenanceDto, @GetHttpOptions() options: HttpOptions) {
    return await this.maintenancesService.create(createMaintenanceDto, options);
  }

  @Get()
  async findAll(@Query() queryParams: QueryParamsDto<this>, @GetHttpOptions() options: HttpOptions) {
    return await this.maintenancesService.findAll(queryParams, options);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @GetHttpOptions() options: HttpOptions) {
    return await this.maintenancesService.findOne(id, options);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateMaintenanceDto: UpdateMaintenanceDto, @GetHttpOptions() options: HttpOptions) {
    return await this.maintenancesService.update(id, updateMaintenanceDto, options);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @GetHttpOptions() options: HttpOptions) {
    return await this.maintenancesService.remove(id, options);
  }
}
