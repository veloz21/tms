import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { GetHttpOptions } from '../../core/decorators';
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
    try {
      return await this.travelsService.create(createTravelDto, options);
    } catch (error) {
      throw new HttpException(error && error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  async findAll(@GetHttpOptions() options: HttpOptions) {
    try {
      return await this.travelsService.findAll(options);
    } catch (error) {
      throw new HttpException(error && error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @GetHttpOptions() options: HttpOptions) {
    try {
      return await this.travelsService.findOne(id, options);
    } catch (error) {
      throw new HttpException(error && error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateTravelDto: UpdateTravelDto, @GetHttpOptions() options: HttpOptions) {
    try {
      return await this.travelsService.update(id, updateTravelDto, options);
    } catch (error) {
      throw new HttpException(error && error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @GetHttpOptions() options: HttpOptions) {
    try {
      return await this.travelsService.remove(id, options);
    } catch (error) {
      throw new HttpException(error && error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
