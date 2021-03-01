import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { GetHttpOptions } from '../../../core/decorators';
import { QueryParamsDto } from '../../../core/dto';
import { DbTransactionInterceptor } from '../../../core/interceptors';
import type { HttpOptions } from '../../../core/interfaces';
import { JwtAuthGuard } from '../../auth';
import { CompleteTravelsService } from './complete-travels.service';
import { CreateCompleteTravelDto } from './dto/create-complete-travel.dto';
import { UpdateCompleteTravelDto } from './dto/update-complete-travel.dto';

@Controller('complete-travels')
@UseGuards(JwtAuthGuard)
@UseInterceptors(DbTransactionInterceptor)
export class CompleteTravelsController {
  constructor(private readonly completeTravelsService: CompleteTravelsService) {}

  @Post()
  async create(@Body() createCompleteTravelDto: CreateCompleteTravelDto, @GetHttpOptions() options: HttpOptions) {
    return await this.completeTravelsService.create(createCompleteTravelDto, options);
  }

  @Get()
  async findAll(@Query() queryParams: QueryParamsDto<this>, @GetHttpOptions() options: HttpOptions) {
    return await this.completeTravelsService.findAll(queryParams, options);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @GetHttpOptions() options: HttpOptions) {
    return await this.completeTravelsService.findOne(id, options);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateTravelDto: UpdateCompleteTravelDto, @GetHttpOptions() options: HttpOptions) {
    return await this.completeTravelsService.update(id, updateTravelDto, options);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @GetHttpOptions() options: HttpOptions) {
    return await this.completeTravelsService.remove(id, options);
  }
}
