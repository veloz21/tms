import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { GetHttpOptions } from '../../../core/decorators';
import { QueryParamsDto } from '../../../core/dto';
import { DbTransactionInterceptor } from '../../../core/interceptors';
import { TransformInterceptor } from '../../../core/interceptors/transform.interceptor';
import { HttpOptions } from '../../../core/interfaces';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { CompletedTravelsService } from './completed-travels.service';
import { CompletedTravelDto } from './dto/completed-travel.dto';
import { CreateCompletedTravelDto } from './dto/create-completed-travel.dto';
import { UpdateCompletedTravelDto } from './dto/update-completed-travel.dto';

@Controller('completed-travels')
@UseGuards(JwtAuthGuard)
@UseInterceptors(DbTransactionInterceptor)
@UseInterceptors(new TransformInterceptor(CompletedTravelDto))
export class CompletedTravelsController {
  constructor(private readonly completedTravelsService: CompletedTravelsService) { }

  @Post()
  create(@Body() createCompletedTravelDto: CreateCompletedTravelDto, @GetHttpOptions() options: HttpOptions) {
    return this.completedTravelsService.create(createCompletedTravelDto, options);
  }

  @Get()
  findAll(@Query() queryParams: QueryParamsDto<this>, @GetHttpOptions() options: HttpOptions) {
    return this.completedTravelsService.findAll(queryParams, options);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @GetHttpOptions() options: HttpOptions) {
    return this.completedTravelsService.findOne(id, options);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateCompletedTravelDto: UpdateCompletedTravelDto, @GetHttpOptions() options: HttpOptions) {
    return this.completedTravelsService.update(id, updateCompletedTravelDto, options);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @GetHttpOptions() options: HttpOptions) {
    return this.completedTravelsService.remove(id, options);
  }
}
