import { Test, TestingModule } from '@nestjs/testing';
import { CompleteTravelsService } from './complete-travels.service';

describe('CompleteTravelsService', () => {
  let service: CompleteTravelsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CompleteTravelsService],
    }).compile();

    service = module.get<CompleteTravelsService>(CompleteTravelsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
