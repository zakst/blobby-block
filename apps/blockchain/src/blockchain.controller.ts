import { Controller, Get, Post } from '@nestjs/common'
import { BlockchainService } from './blockchain.service'

@Controller('blobby')
export class BlockchainController {
  constructor() {
    new BlockchainService([], [])
  }

  @Get('/blockchain')
  public async getBlockChain(): Promise<any> {
    return 'block'
  }

  @Post('/transaction')
  public async createTransaction(): Promise<any> {
    return 'transaction'
  }

  @Get('/mine')
  public async mine(): Promise<any> {
    return 'mine'
  }
}
