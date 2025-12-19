import { Test, TestingModule } from '@nestjs/testing';
import { BurgersService } from './burgers.service';

describe('BurgersService', () => {
  let service: BurgersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BurgersService],
    }).compile();

    service = module.get<BurgersService>(BurgersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
