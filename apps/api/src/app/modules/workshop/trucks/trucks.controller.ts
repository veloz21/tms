import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { GetHttpOptions } from '../../../core/decorators';
import { QueryParamsDto } from '../../../core/dto';
import { DbTransactionInterceptor } from '../../../core/interceptors';
import { TransformInterceptor } from '../../../core/interceptors/transform.interceptor';
import type { HttpOptions } from '../../../core/interfaces';
import { stringToMongoId } from '../../../core/utils';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { CreateTruckDto } from './dto/create-truck.dto';
import { TruckDto } from './dto/truck.dto';
import { UpdateTruckDto } from './dto/update-truck.dto';
import { TrucksService } from './trucks.service';

@Controller('')
@UseGuards(JwtAuthGuard)
@UseInterceptors(DbTransactionInterceptor)
@UseInterceptors(new TransformInterceptor(TruckDto))
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
    return await this.trucksService.findOne(stringToMongoId(id), options);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateTruckDto: UpdateTruckDto, @GetHttpOptions() options: HttpOptions) {
    const updatedTruck = await this.trucksService.update(stringToMongoId(id), updateTruckDto, options);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @GetHttpOptions() options: HttpOptions) {
    return await this.trucksService.remove(stringToMongoId(id), options);
  }
}
