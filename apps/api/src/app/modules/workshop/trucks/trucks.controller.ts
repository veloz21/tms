import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { GetHttpOptions } from '../../../core/decorators';
import { QueryParamsDto } from '../../../core/dto';
import { DbTransactionInterceptor } from '../../../core/interceptors';
import type { HttpOptions } from '../../../core/interfaces';
import { JwtAuthGuard } from '../../auth';
import { CreateTruckDto } from './dto/create-truck.dto';
import { UpdateTruckDto } from './dto/update-truck.dto';
import { TrucksService } from './trucks.service';

@Controller('')
@UseGuards(JwtAuthGuard)
@UseInterceptors(DbTransactionInterceptor)
export class TrucksController {
  constructor(private readonly trucksService: TrucksService) { }

  @Post()
  async create(@Body() createTruckDto: CreateTruckDto, @GetHttpOptions() options: HttpOptions) {
    return await this.trucksService.create(createTruckDto, options);
  }

  @Get()
  async findAll(@Query() queryParams: QueryParamsDto<this>, @GetHttpOptions() options: HttpOptions) {
    return await this.trucksService.findAll(queryParams, options);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @GetHttpOptions() options: HttpOptions) {
    return await this.trucksService.findOne(id, options);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateTruckDto: UpdateTruckDto, @GetHttpOptions() options: HttpOptions) {
    const updatedTruck = await this.trucksService.update(id, updateTruckDto, options);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @GetHttpOptions() options: HttpOptions) {
    return await this.trucksService.remove(id, options);
  }
}
