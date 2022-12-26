import { Body, Controller, Get, HttpStatus, Post } from '@nestjs/common'
import { BlockchainService } from './blockchain.service'
import TransactionDto from './dtos/transaction.dto'
import TransactionResponseDto from './dtos/transactionResponse.dto'
import BlockchainResponseDto from './dtos/blockchainResponse.dto'
import MinedBlockResponseDto from './dtos/minedBlockResponse.dto'
import BlockDto from './dtos/block.dto'
import { v4 as uuidv4 } from 'uuid'

const nodeId = uuidv4().split('-').join('')

@Controller('blobby')
export class BlockchainController {
  private readonly blobby: BlockchainService
  constructor() {
    this.blobby = new BlockchainService([], [])
  }

  @Get('/blockchain')
  public async getBlockChain(): Promise<BlockchainResponseDto> {
    return {
      status: HttpStatus.OK,
      message: 'Blobby Block',
      blockchain: this.blobby
    }
  }

  @Post('/transaction')
  public async createTransaction(@Body() data: TransactionDto): Promise<TransactionResponseDto> {
    try {
      const blockId = this.blobby.queueTransaction(data.amount, data.sender, data.receiver)
      return {
        status: HttpStatus.OK,
        message: 'Transaction queued successfully',
        blockId,
        transaction: data,
      }
    } catch (e) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Failed to queue transaction',
        blockId: null,
        transaction: data,
        errors: e
      }
    }
  }

  @Get('/mine')
  public async mine(): Promise<MinedBlockResponseDto> {
    try {
      const block: BlockDto = this.blobby.mine(this.blobby.getPendingTransactions())
      this.blobby.queueTransaction(15.43, 'reward_sender', nodeId) // create reward for the miner
      return {
        status:HttpStatus.OK,
        message: 'Block was successfully mined',
        block,
      }
    } catch (e) {
      return {
        status:HttpStatus.INTERNAL_SERVER_ERROR,
        block: null,
        message: 'Failed to mine a new block',
        errors: e
      }
    }
  }
}
