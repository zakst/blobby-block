import { Body, Controller, Get, HttpException, HttpStatus, Post, UsePipes, ValidationPipe } from '@nestjs/common'
import { BlockchainService } from './blockchain.service'
import TransactionDto from './dtos/transaction.dto'
import BlockchainResponseDto from './dtos/blockchainResponse.dto'
import MinedBlockResponseDto from './dtos/minedBlockResponse.dto'
import BlockDto from './dtos/block.dto'
import { v4 as uuidv4 } from 'uuid'
import BroadcastRequestDto from './dtos/broadcastRequest.dto'
import ResponseDto from './dtos/response.dto'
import axios from 'axios'
import RegisterNodeRequestDto from './dtos/registerNodeRequest.dto'
import SyncNodesRequestDto from './dtos/syncNodesRequest.dto'
import { PinoLogger } from 'nestjs-pino'

const nodeId = uuidv4().split('-').join('')

@Controller('blobby')
export class BlockchainController {
  private readonly blobby: BlockchainService

  constructor(private readonly logger: PinoLogger) {
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

  @Post('/mine')
  public async mine(): Promise<MinedBlockResponseDto> {
    try {
      const block: BlockDto = this.blobby.mine(this.blobby.getPendingTransactions())
      this.logger.debug(block)
      const requests = this.blobby.blockchainNodes.map(node => {
        const endpoint = `${node}/blobby/mined-block`
        return axios.post(endpoint, block)
      })

      await Promise.all(requests)

      const endpoint = `${this.blobby.nodeUrl}/blobby/decentralised/transaction`
      await axios.post(endpoint, {
        amount: 14,
        sender: '00',
        receiver: nodeId
      })
      return {
        status: HttpStatus.OK,
        message: `Block was successfully and broadcast successfully from ${nodeId}`,
        block,
      }
    } catch (e) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        block: null,
        message: e,
      }
    }
  }
  @Post('/mined-block')
  public async minedBlock(@Body() data): Promise<MinedBlockResponseDto> {
    const lastBlock = this.blobby.getLastBlock()
    const isValidPreviousBlockHash = lastBlock.hash === data.previousBlockHash
    const isValidBlockId = lastBlock['blockId'] + 1 === data.blockId
    this.logger.debug(`lastBlock previousBlockHash: ${lastBlock.previousBlockHash}`)
    this.logger.debug(`data previousBlockHash: ${data.previousBlockHash}`)
    this.logger.debug(`lastBlock blockId: ${lastBlock.blockId + 1}`)
    this.logger.debug(`data blockId: ${data.blockId}`)

    if (isValidPreviousBlockHash && isValidBlockId) {
      this.blobby.chain.push(data)
      this.blobby.pendingTransactions = []
      return {
        status: HttpStatus.OK,
        message: 'Block was successfully recorded',
        block: data
      }
    }
    return {
      status: HttpStatus.BAD_REQUEST,
      message: 'Block is not valid',
      block: data
    }
  }

  @Post('/transaction')
  public async createTransaction(@Body() data: TransactionDto): Promise<ResponseDto> {
    const blockId = this.blobby.queueTransaction(data)
    return {
      status: HttpStatus.OK,
      message: `Transaction queued successfully at ${nodeId} with blockId ${blockId}`,
    }
  }

  @Post('/decentralised/transaction')
  public async decentralisedTransaction(@Body() data: TransactionDto): Promise<ResponseDto> {
    const transaction = this.blobby.createTransaction(data.amount, data.sender, data.receiver)
    this.blobby.queueTransaction(transaction)
    const requests = this.blobby.blockchainNodes.map(node => {
      const endpoint = `${node}/blobby/transaction`
      return axios.post(endpoint, transaction)
    })

    await Promise.all(requests)
    return {
      status: HttpStatus.OK,
      message: `Transaction broadcast to all nodes successfully from ${nodeId}`,
    }
  }

  @Post('/broadcast')
  public async broadcastNode(@Body() data: BroadcastRequestDto): Promise<ResponseDto> {
    try {
      if (!this.blobby.blockchainNodes.includes(data.nodeUrl)) {
        this.blobby.blockchainNodes.push(data.nodeUrl)
      }
      const requests = this.blobby.blockchainNodes.map(node => {
        const endpoint = `${node}/blobby/register`
        const body = {
          nodeUrl: data.nodeUrl
        }
        return axios.post(endpoint, body)
      })

      await Promise.all(requests)
      const endpoint = `${data.nodeUrl}/blobby/sync`
      const body = {
        nodeUrls: [...this.blobby.blockchainNodes, this.blobby.nodeUrl]
      }
      await axios.post(endpoint, body)
      return {
        status: HttpStatus.OK,
        message: 'Node registration and broadcast was a success.'
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
      return  {
        status: HttpStatus.OK,
        message: `Node either registered or does not need to. There are ${this.blobby.blockchainNodes.length} nodes on blobby`
      }
    }
    this.blobby.blockchainNodes.push(data.nodeUrl)
    return  {
      status: HttpStatus.OK,
      message: `Node registered there are now ${this.blobby.blockchainNodes.length} nodes on blobby`
    }
  }

  @Post('/sync')
  public async syncNodes(@Body() data: SyncNodesRequestDto): Promise<ResponseDto> {
    data.nodeUrls.forEach(nodeUrl => {
      const isNodeRegistered = this.blobby.blockchainNodes.includes(nodeUrl)
      const isNodeCurrent = this.blobby.nodeUrl === nodeUrl
      if(!isNodeRegistered && !isNodeCurrent) {
        this.blobby.blockchainNodes.push(nodeUrl)
      }
    })
    return {
      status: HttpStatus.OK,
      message: `${data.nodeUrls.length} nodes registered successfully`
    }
  }
}
