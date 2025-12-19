import { Test, TestingModule } from '@nestjs/testing';
import { BurgersController } from './burgers.controller';

describe('BurgersController', () => {
  let controller: BurgersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BurgersController],
    }).compile();

    controller = module.get<BurgersController>(BurgersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
