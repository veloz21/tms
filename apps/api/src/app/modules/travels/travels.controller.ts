import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { GetHttpOptions } from '../../core/decorators';
import { QueryParamsDto } from '../../core/dto';
import { DbTransactionInterceptor } from '../../core/interceptors';
import type { HttpOptions } from '../../core/interfaces';
import { JwtAuthGuard } from '../auth';
import { CreateTravelDto } from './dto/create-travel.dto';
import { UpdateTravelDto } from './dto/update-travel.dto';
import { TravelsService } from './travels.service';

@Controller('')
@UseGuards(JwtAuthGuard)
@UseInterceptors(DbTransactionInterceptor)
export class TravelsController {
  constructor(private readonly travelsService: TravelsService) { }

  @Post()
  async create(@Body() createTravelDto: CreateTravelDto, @GetHttpOptions() options: HttpOptions) {
    return await this.travelsService.create(createTravelDto, options);
  }

  @Get()
  async findAll(@Query() queryParams: QueryParamsDto<this>, @GetHttpOptions() options: HttpOptions) {
    return await this.travelsService.findAll(queryParams, options);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @GetHttpOptions() options: HttpOptions) {
    return await this.travelsService.findOne(id, options);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateTravelDto: UpdateTravelDto, @GetHttpOptions() options: HttpOptions) {
    return await this.travelsService.update(id, updateTravelDto, options);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @GetHttpOptions() options: HttpOptions) {
    return await this.travelsService.remove(id, options);
  }
}
