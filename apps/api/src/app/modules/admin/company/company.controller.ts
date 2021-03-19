import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Put,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { GetHttpOptions } from '../../../core/decorators';
import { DbTransactionInterceptor } from '../../../core/interceptors';
import type { HttpOptions } from '../../../core/interfaces';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { CompanyService } from './company.service';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Controller('')
@UseInterceptors(DbTransactionInterceptor)
export class CompanyController {
  constructor(private readonly companyService: CompanyService) { }

  @Get('validate/:company')
  async validate(@Param('company') company, @GetHttpOptions() options: HttpOptions) {
    console.log('validate company', company);
    try {
      await this.companyService.findOneByName(company, options);
      return;
    } catch (error) {
      console.log('validate company error');
      throw new HttpException(error && error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('current')
  @UseGuards(JwtAuthGuard)
  async getCurrentCompany(@GetHttpOptions() options: HttpOptions) {
    try {
      return await this.companyService.findOne(options.company, options);
    } catch (error) {
      throw new HttpException(error && error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string, @GetHttpOptions() options: HttpOptions) {
    try {
      return await this.companyService.findOne(id, options);
    } catch (error) {
      throw new HttpException(error && error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
    @GetHttpOptions() options: HttpOptions
  ) {
    try {
      return await this.companyService.update(id, updateCompanyDto, options);
    } catch (error) {
      throw new HttpException(error && error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(
    @Param('id') id: string,
    @GetHttpOptions() options: HttpOptions
  ) {
    try {
      return await this.companyService.remove(id, options);
    } catch (error) {
      throw new HttpException(error && error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
