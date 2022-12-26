import { Test, TestingModule } from '@nestjs/testing'
import { BlockchainController } from './blockchain.controller'
import { BlockchainService } from './blockchain.service'

describe('BlockchainController', () => {
  let blockchainController: BlockchainController

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [BlockchainController],
      providers: [BlockchainService],
    }).compile()

    blockchainController = app.get<BlockchainController>(BlockchainController)
  });

  describe('root', () => {
    it('should be 1', () => {
      expect(1).toBe(1);
    });
  });
});
