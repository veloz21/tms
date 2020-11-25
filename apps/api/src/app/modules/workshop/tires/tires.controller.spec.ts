import { Test, TestingModule } from '@nestjs/testing';
import { TiresController } from './tires.controller';
import { TiresService } from './tires.service';

describe('TiresController', () => {
  let controller: TiresController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TiresController],
      providers: [TiresService],
    }).compile();

    controller = module.get<TiresController>(TiresController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
