import { Test, TestingModule } from '@nestjs/testing';
import { CompleteTravelsController } from './complete-travels.controller';
import { CompleteTravelsService } from './complete-travels.service';

describe('CompleteTravelsController', () => {
  let controller: CompleteTravelsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompleteTravelsController],
      providers: [CompleteTravelsService],
    }).compile();

    controller = module.get<CompleteTravelsController>(CompleteTravelsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
