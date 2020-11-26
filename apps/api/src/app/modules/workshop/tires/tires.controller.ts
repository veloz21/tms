import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { GetHttpOptions } from '../../../core/decorators';
import { QueryParamsDto } from '../../../core/dto';
import { DbTransactionInterceptor } from '../../../core/interceptors';
import type { HttpOptions } from '../../../core/interfaces';
import { JwtAuthGuard } from '../../auth';
import { CreateTireDto } from './dto/create-tire.dto';
import { UpdateTireDto } from './dto/update-tire.dto';
import { TiresService } from './tires.service';

@Controller('')
@UseGuards(JwtAuthGuard)
@UseInterceptors(DbTransactionInterceptor)
export class TiresController {
  constructor(private readonly tiresService: TiresService) { }

  @Post()
  async create(@Body() createTireDto: CreateTireDto, @GetHttpOptions() options: HttpOptions) {
    return await this.tiresService.create(createTireDto, options);
  }

  @Get()
  async findAll(@Query() queryParams: QueryParamsDto<this>, @GetHttpOptions() options: HttpOptions) {
    return await this.tiresService.findAll(queryParams, options);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @GetHttpOptions() options: HttpOptions) {
    return await this.tiresService.findOne(id, options);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateTireDto: UpdateTireDto, @GetHttpOptions() options: HttpOptions) {
    return await this.tiresService.update(id, updateTireDto, options);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @GetHttpOptions() options: HttpOptions) {
    return await this.tiresService.remove(id, options);
  }
}
