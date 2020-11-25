import { Injectable } from '@nestjs/common';
import { CreateTireDto } from './dto/create-tire.dto';
import { UpdateTireDto } from './dto/update-tire.dto';

@Injectable()
export class TiresService {
  create(createTireDto: CreateTireDto) {
    return 'This action adds a new tire';
  }

  findAll() {
    return `This action returns all tires`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tire`;
  }

  update(id: number, updateTireDto: UpdateTireDto) {
    return `This action updates a #${id} tire`;
  }

  remove(id: number) {
    return `This action removes a #${id} tire`;
  }
}
