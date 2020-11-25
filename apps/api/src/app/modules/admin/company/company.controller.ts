import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) { }

  @Post()
  async create(@Body() createCompanyDto: CreateCompanyDto) {
    try {
      return await this.companyService.create(createCompanyDto);
    } catch (error) {
      throw new HttpException(error && error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  async findAll() {
    try {
      return await this.companyService.findAll();
    } catch (error) {
      throw new HttpException(error && error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('validate/:company')
  async validate(@Param('company') company) {
    try {
      await this.companyService.findOneByName(company);
      return;
    } catch (error) {
      throw new HttpException(error && error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.companyService.findOne(id);
    } catch (error) {
      throw new HttpException(error && error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto) {
    try {
      return await this.companyService.update(id, updateCompanyDto);
    } catch (error) {
      throw new HttpException(error && error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return await this.companyService.remove(id);
    } catch (error) {
      throw new HttpException(error && error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
