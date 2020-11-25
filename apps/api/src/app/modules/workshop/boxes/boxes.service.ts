import { Injectable } from '@nestjs/common';
import { CreateBoxDto } from './dto/create-box.dto';
import { UpdateBoxDto } from './dto/update-box.dto';

@Injectable()
export class BoxesService {
  create(createBoxDto: CreateBoxDto) {
    return 'This action adds a new box';
  }

  findAll() {
    return `This action returns all boxes`;
  }

  findOne(id: string) {
    return `This action returns a #${id} box`;
  }

  update(id: string, updateBoxDto: UpdateBoxDto) {
    return `This action updates a #${id} box`;
  }

  remove(id: string) {
    return `This action removes a #${id} box`;
  }
}
