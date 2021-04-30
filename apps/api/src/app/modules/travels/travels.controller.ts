import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { GetHttpOptions } from '../../core/decorators';
import { QueryParamsDto } from '../../core/dto';
import { DbTransactionInterceptor } from '../../core/interceptors';
import { TransformInterceptor } from '../../core/interceptors/transform.interceptor';
import type { HttpOptions } from '../../core/interfaces';
import { stringToMongoId } from '../../core/utils';
import { EmployeesService } from '../admin/employees/employees.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BoxesService } from '../workshop/boxes/boxes.service';
import { TrucksService } from '../workshop/trucks';
import { CreateTravelDto } from './dto/create-travel.dto';
import { TravelStatusDto } from './dto/travel-status.dto';
import { TravelDto } from './dto/travel.dto';
import { UpdateTravelStatusDto } from './dto/update-travel-status.dto';
import { UpdateTravelDto } from './dto/update-travel.dto';
import { TravelsService } from './travels.service';

@Controller('')
@UseGuards(JwtAuthGuard)
@UseInterceptors(DbTransactionInterceptor)
export class TravelsController {
  constructor(
    private readonly travelsService: TravelsService,
    private readonly boxService: BoxesService,
    private readonly truckService: TrucksService,
    private readonly employeeService: EmployeesService
  ) {}

  @Get('status')
  @UseInterceptors(new TransformInterceptor(TravelStatusDto))
  async getTravelStatus(@GetHttpOptions() options: HttpOptions) {
    return await this.travelsService.getTravelStatus(options);
  }

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseInterceptors(new TransformInterceptor(TravelDto))
  async create(@Body() createTravelDto: CreateTravelDto, @GetHttpOptions() options: HttpOptions) {
    return await this.travelsService.create(createTravelDto, options);
  }

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseInterceptors(new TransformInterceptor(TravelDto))
  async findAll(@Query() queryParams: QueryParamsDto<this>, @GetHttpOptions() options: HttpOptions) {
    return await this.travelsService.findAll(queryParams, options);
  }

  @Get(':id')
  @UseInterceptors(new TransformInterceptor(TravelDto))
  async findOne(@Param('id') id: string, @GetHttpOptions() options: HttpOptions) {
    return await this.travelsService.findOne(stringToMongoId(id), options);
  }

  @Put(':id/status')
  @UseInterceptors(new TransformInterceptor(TravelDto))
  async updateTravelStatus(@Param('id') id: string, @Body() updateTravelStatusDto: UpdateTravelStatusDto, @GetHttpOptions() options: HttpOptions) {
    const travel = await this.travelsService.updateTravelStatus(stringToMongoId(id), updateTravelStatusDto, options);
    const travelDto = plainToClass(TravelDto, travel, { enableImplicitConversion: true });
    const travelStatus = await this.travelsService.findOneStatus(travelDto.currentStatus, options);
    const travelStatusDto = plainToClass(TravelStatusDto, travelStatus, { enableImplicitConversion: true });
    await this.boxService.updateStatusByTravelStatus(stringToMongoId(travelDto.box._id), travelStatusDto, options);
    await this.truckService.updateStatusByTravelStatus(stringToMongoId(travelDto.truck._id), travelStatusDto, options);
    await this.employeeService.updateStatusByTravelStatus(stringToMongoId(travelDto.operator._id), travelStatusDto, options);
    return travel;
  }

  @Put(':id')
  @UseInterceptors(new TransformInterceptor(TravelDto))
  async update(@Param('id') id: string, @Body() updateTravelDto: UpdateTravelDto, @GetHttpOptions() options: HttpOptions) {
    return await this.travelsService.update(stringToMongoId(id), updateTravelDto, options);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @GetHttpOptions() options: HttpOptions) {
    return await this.travelsService.remove(stringToMongoId(id), options);
  }
}
