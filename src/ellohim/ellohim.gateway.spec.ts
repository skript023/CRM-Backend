import { Test, TestingModule } from '@nestjs/testing';
import { EllohimGateway } from './ellohim.gateway';
import { EllohimService } from './ellohim.service';

describe('EllohimGateway', () => {
  let gateway: EllohimGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EllohimGateway, EllohimService],
    }).compile();

    gateway = module.get<EllohimGateway>(EllohimGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
