import { Test, TestingModule } from '@nestjs/testing';
import { BlockchainController } from './blockchain.controller';
import { BlockchainService } from './blockchain.service';

describe('BlockchainController', () => {
  let blockchainController: BlockchainController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [BlockchainController],
      providers: [BlockchainService],
    }).compile();

    blockchainController = app.get<BlockchainController>(BlockchainController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(blockchainController.getHello()).toBe('Hello World!');
    });
  });
});
