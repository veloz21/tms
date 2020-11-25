import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CreateTireDto } from './dto/create-tire.dto';
import { UpdateTireDto } from './dto/update-tire.dto';
import { TiresService } from './tires.service';

@Controller('')
export class TiresController {
  constructor(private readonly tiresService: TiresService) { }

  @Post()
  create(@Body() createTireDto: CreateTireDto) {
    return this.tiresService.create(createTireDto);
  }

  @Get()
  findAll(@Param() params) {
    console.log('TiresController params', params);
    return this.tiresService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tiresService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateTireDto: UpdateTireDto) {
    return this.tiresService.update(+id, updateTireDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tiresService.remove(+id);
  }
}
