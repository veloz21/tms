import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CreateTravelDto } from './dto/create-travel.dto';
import { UpdateTravelDto } from './dto/update-travel.dto';
import { TravelsService } from './travels.service';

@Controller('')
export class TravelsController {
  constructor(private readonly travelsService: TravelsService) { }

  @Post()
  create(@Body() createTravelDto: CreateTravelDto) {
    return this.travelsService.create(createTravelDto);
  }

  @Get()
  findAll() {
    return this.travelsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.travelsService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateTravelDto: UpdateTravelDto) {
    return this.travelsService.update(+id, updateTravelDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.travelsService.remove(+id);
  }
}
