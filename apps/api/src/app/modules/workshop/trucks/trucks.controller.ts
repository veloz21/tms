import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { CreateTruckDto } from './dto/create-truck.dto';
import { UpdateTruckDto } from './dto/update-truck.dto';
import { TrucksService } from './trucks.service';

@Controller('')
export class TrucksController {
  constructor(private readonly trucksService: TrucksService) { }

  @Post()
  async create(@Body() createTruckDto: CreateTruckDto) {
    try {
      return await this.trucksService.create(createTruckDto);
    } catch (error) {
      throw new HttpException(error && error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  async findAll() {
    try {
      return await this.trucksService.findAll();
    } catch (error) {
      throw new HttpException(error && error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.trucksService.findOne(id);
    } catch (error) {
      throw new HttpException(error && error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateTruckDto: UpdateTruckDto) {
    try {
      const updatedTruck = await this.trucksService.update(id, updateTruckDto);
      return updatedTruck;
    } catch (error) {
      throw new HttpException(error && error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return await this.trucksService.remove(id);
    } catch (error) {
      throw new HttpException(error && error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
