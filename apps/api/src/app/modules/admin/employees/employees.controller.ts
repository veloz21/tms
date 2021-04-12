import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { GetHttpOptions } from '../../../core/decorators';
import { QueryParamsDto } from '../../../core/dto';
import { DbTransactionInterceptor } from '../../../core/interceptors';
import { TransformInterceptor } from '../../../core/interceptors/transform.interceptor';
import type { HttpOptions } from '../../../core/interfaces';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { EmployeeDto } from './dto/employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { EmployeesService } from './employees.service';

@Controller('')
@UseGuards(JwtAuthGuard)
@UseInterceptors(DbTransactionInterceptor)
@UseInterceptors(new TransformInterceptor(EmployeeDto))
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) { }

  @Post()
  async create(@Body() createEmployeeDto: CreateEmployeeDto, @GetHttpOptions() options: HttpOptions) {
    return await this.employeesService.create(createEmployeeDto, options);
  }

  @Get()
  async findAll(@Query() queryParams: QueryParamsDto<this>, @GetHttpOptions() options: HttpOptions) {
    return await this.employeesService.findAll(queryParams, options);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @GetHttpOptions() options: HttpOptions) {
    return await this.employeesService.findOne(id, options);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateEmployeeDto: UpdateEmployeeDto, @GetHttpOptions() options: HttpOptions) {
    return await this.employeesService.update(id, updateEmployeeDto, options);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @GetHttpOptions() options: HttpOptions) {
    return await this.employeesService.remove(id, options);
  }
}
