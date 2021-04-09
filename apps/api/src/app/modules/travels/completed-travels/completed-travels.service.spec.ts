import { Test, TestingModule } from '@nestjs/testing';
import { CompletedTravelsService } from './completed-travels.service';

describe('CompletedTravelsService', () => {
  let service: CompletedTravelsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CompletedTravelsService],
    }).compile();

    service = module.get<CompletedTravelsService>(CompletedTravelsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
