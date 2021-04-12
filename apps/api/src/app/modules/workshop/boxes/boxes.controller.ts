import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { GetHttpOptions } from '../../../core/decorators';
import { QueryParamsDto } from '../../../core/dto';
import { DbTransactionInterceptor } from '../../../core/interceptors';
import { TransformInterceptor } from '../../../core/interceptors/transform.interceptor';
import type { HttpOptions } from '../../../core/interfaces';
import { stringToMongoId } from '../../../core/utils';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { BoxesService } from './boxes.service';
import { BoxDto } from './dto/box.dto';
import { CreateBoxDto } from './dto/create-box.dto';
import { UpdateBoxDto } from './dto/update-box.dto';

@Controller('')
@UseGuards(JwtAuthGuard)
@UseInterceptors(DbTransactionInterceptor)
@UseInterceptors(new TransformInterceptor(BoxDto))
export class BoxesController {
  constructor(private readonly boxesService: BoxesService) { }

  @Post()
  async create(@Body() createBoxDto: CreateBoxDto, @GetHttpOptions() options: HttpOptions) {
    return await this.boxesService.create(createBoxDto, options);
  }

  @Get()
  async findAll(@Query() queryParams: QueryParamsDto<this>, @GetHttpOptions() options: HttpOptions) {
    return await this.boxesService.findAll(queryParams, options);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @GetHttpOptions() options: HttpOptions) {
    return await this.boxesService.findOne(stringToMongoId(id), options);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateBoxDto: UpdateBoxDto, @GetHttpOptions() options: HttpOptions) {
    return await this.boxesService.update(stringToMongoId(id), updateBoxDto, options);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @GetHttpOptions() options: HttpOptions) {
    return await this.boxesService.remove(stringToMongoId(id), options);
  }
}
