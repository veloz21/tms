import { Test, TestingModule } from '@nestjs/testing';
import { CompletedTravelsController } from './completed-travels.controller';
import { CompletedTravelsService } from './completed-travels.service';

describe('CompletedTravelsController', () => {
  let controller: CompletedTravelsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompletedTravelsController],
      providers: [CompletedTravelsService],
    }).compile();

    controller = module.get<CompletedTravelsController>(CompletedTravelsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
