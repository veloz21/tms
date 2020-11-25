import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { CreateTireDto } from './dto/create-tire.dto';
import { UpdateTireDto } from './dto/update-tire.dto';
import { TiresService } from './tires.service';

@Controller('')
export class TiresController {
  constructor(private readonly tiresService: TiresService) { }

  @Post()
  async create(@Body() createTireDto: CreateTireDto) {
    try {
      return await this.tiresService.create(createTireDto);
    } catch (error) {
      throw new HttpException(error && error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  async findAll(@Param() params) {
    console.log('TiresController params', params);
    try {
      return await this.tiresService.findAll();
    } catch (error) {
      throw new HttpException(error && error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.tiresService.findOne(id);
    } catch (error) {
      throw new HttpException(error && error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateTireDto: UpdateTireDto) {
    try {
      return await this.tiresService.update(id, updateTireDto);
    } catch (error) {
      throw new HttpException(error && error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return await this.tiresService.remove(id);
    } catch (error) {
      throw new HttpException(error && error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
