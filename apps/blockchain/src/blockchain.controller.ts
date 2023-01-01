import { Body, Controller, Get, HttpException, HttpStatus, Post, UsePipes, ValidationPipe } from '@nestjs/common'
import { BlockchainService } from './blockchain.service'
import TransactionDto from './dtos/transaction.dto'
import TransactionResponseDto from './dtos/transactionResponse.dto'
import BlockchainResponseDto from './dtos/blockchainResponse.dto'
import MinedBlockResponseDto from './dtos/minedBlockResponse.dto'
import BlockDto from './dtos/block.dto'
import { v4 as uuidv4 } from 'uuid'
import BroadcastRequestDto from './dtos/broadcastRequest.dto'
import ResponseDto from './dtos/response.dto'
import axios from 'axios'
import RegisterNodeRequestDto from './dtos/registerNodeRequest.dto'

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
    const blockId = this.blobby.queueTransaction(data.amount, data.sender, data.receiver)
    return {
      status: HttpStatus.OK,
      message: 'Transaction queued successfully',
      blockId,
      transaction: data,
    }
  }

  @Get('/mine')
  public async mine(): Promise<MinedBlockResponseDto> {
    try {
      const block: BlockDto = this.blobby.mine(this.blobby.getPendingTransactions())
      this.blobby.queueTransaction(15.43, 'reward_sender', nodeId) // create reward for the miner
      return {
        status: HttpStatus.OK,
        message: 'Block was successfully mined',
        block,
      }
    } catch (e) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        block: null,
        message: 'Failed to mine a new block',
      }
    }
  }

  @Post('/broadcast')
  public async broadcastNode(@Body() data: BroadcastRequestDto): Promise<ResponseDto> {
    try {
      if (!this.blobby.blockchainNodes.includes(data.nodeUrl)) {
        this.blobby.blockchainNodes.push(data.nodeUrl)
      }
      const requests = this.blobby.blockchainNodes.map(async node => {
        const endpoint = `${node}/node/register`
        const body = {
          nodeUrl: data.nodeUrl
        }
        return axios.post(endpoint, JSON.stringify(body))
      })

      const response = await Promise.all(requests)

      const syncRequests = response.map(async () => {
        const endpoint = `${data.nodeUrl}/node/sync`
        const body = {
          nodeUrls: [...this.blobby.blockchainNodes, this.blobby.nodeUrl]
        }
        return axios.post(endpoint, JSON.stringify(body))
      })
      await Promise.all(syncRequests)
      return {
        status: HttpStatus.OK,
        message: 'Node registration and broadcast was a success'
      }
    } catch (e) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: e
      }
    }
  }

  @Post('/register')
  public async registerNode(@Body() data: RegisterNodeRequestDto): Promise<ResponseDto> {
    const isNodeRegistered = this.blobby.blockchainNodes.includes(data.nodeUrl)
    const isNodeCurrent = this.blobby.nodeUrl === data.nodeUrl
    if(isNodeRegistered || isNodeCurrent) {
      return {
        status: HttpStatus.CONFLICT,
        message: `Can not register node`
      }
    }
    this.blobby.blockchainNodes.push(data.nodeUrl)
    console.log(this.blobby.blockchainNodes)
    return  {
      status: HttpStatus.OK,
      message: `Node registered there are now ${this.blobby.blockchainNodes.length} nodes on blobby`
    }
  }

  @Post('/sync')
  public async syncNodes(@Body() data: RegisterNodeRequestDto[]): Promise<any> {

  }
}
