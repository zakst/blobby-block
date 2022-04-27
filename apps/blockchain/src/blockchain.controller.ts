import { Controller, Get } from '@nestjs/common';
import { BlockchainService } from './blockchain.service';

@Controller()
export class BlockchainController {
  constructor(private readonly blockchainService: BlockchainService) {}

  @Get()
  getHello(): string {
    return this.blockchainService.getHello();
  }
}
