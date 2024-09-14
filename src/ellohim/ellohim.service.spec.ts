import { Test, TestingModule } from '@nestjs/testing';
import { EllohimService } from './ellohim.service';

describe('EllohimService', () => {
  let service: EllohimService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EllohimService],
    }).compile();

    service = module.get<EllohimService>(EllohimService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
