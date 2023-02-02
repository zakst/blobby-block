import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common'
import { BlockchainService } from './blockchain.service'
import { RewardService } from './reward.service'
import TransactionDto from './dtos/transaction.dto'
import BlockchainResponseDto from './dtos/blockchainResponse.dto'
import BlockResponseDto from './dtos/blockResponse.dto'
import BlockDto from './dtos/block.dto'
import { v4 as uuidv4 } from 'uuid'
import BroadcastRequestDto from './dtos/broadcastRequest.dto'
import ResponseDto from './dtos/response.dto'
import axios, { AxiosResponse } from 'axios'
import RegisterNodeRequestDto from './dtos/registerNodeRequest.dto'
import SyncNodesRequestDto from './dtos/syncNodesRequest.dto'
import { PinoLogger } from 'nestjs-pino'
import ConsensusResponseDto from './dtos/consensusResponse.dto'
import * as process from 'process'
import TransactionResponseDto, { TransactionSearchDto } from './dtos/transactionResponse.dto'
import AddressTransactionsDto from './dtos/addressTransactions.dto'

const nodeId = uuidv4().split('-').join('')

@Controller('blobby')
export class BlockchainController {
  private readonly blobby: BlockchainService
  private readonly rewardService: RewardService

  constructor(private readonly logger: PinoLogger) {
    this.blobby = new BlockchainService([], [])
    this.rewardService = new RewardService()
    this.logger.debug(`This is nodeId: ${nodeId} running on port: ${process.env.PORT}`)
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
  public async mine(): Promise<BlockResponseDto> {
    try {
      const block: BlockDto = this.blobby.mine(this.blobby.getPendingTransactions())
      const requests = this.blobby.blockchainNodes.map(node => {
        const endpoint = `${node}/blobby/mined-block`
        return axios.post(endpoint, block)
      })

      await Promise.all(requests)
      await this.rewardService.reward(this.blobby.nodeUrl, nodeId)

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
  public async minedBlock(@Body() data): Promise<BlockResponseDto> {
    const lastBlock = this.blobby.getLastBlock()
    const isValidPreviousBlockHash = lastBlock.hash === data.previousBlockHash
    const isValidBlockId = lastBlock['blockId'] + 1 === data.blockId

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

  @Get('/consensus')
  public async longestChainRule(): Promise<ConsensusResponseDto> {
    const allBlockChains = this.blobby.blockchainNodes.map(node => {
      const endpoint = `${node}/blobby/blockchain`
      return axios.get(endpoint)
    })

    const blockchains: AxiosResponse[] = await Promise.all(allBlockChains)
    let maxChainLength: number = this.blobby.chain.length
    let sourceOfTruthChain: BlockDto[]
    let sourceOfTruthTransactions: TransactionDto[]
    blockchains.forEach(blockchainData => {
      const currentChainLength = blockchainData.data.blockchain.chain.length
      if( currentChainLength > maxChainLength) {
        maxChainLength = currentChainLength
        sourceOfTruthChain = blockchainData.data.blockchain
        sourceOfTruthTransactions = blockchainData.data.blockchain.pendingTransactions
      }
    })
    const sourceOfTruthChainIsValid = sourceOfTruthChain && this.blobby.isChainValid(sourceOfTruthChain)
    if(!sourceOfTruthChain || !sourceOfTruthChainIsValid) {
      return {
        status: HttpStatus.OK,
        message: `Chain was not updated due to invalidity`,
        chain: this.blobby.chain
      }
    }
    else {
      this.blobby.chain = sourceOfTruthChain
      this.blobby.pendingTransactions = sourceOfTruthTransactions
      return {
        status: HttpStatus.OK,
        message: `Chain updated`,
        chain: sourceOfTruthChain
      }
    }
  }

  @Get('/block/:blockhash')
  public async getBlockByHash(@Param() params): Promise<BlockResponseDto> {
    const block: BlockDto = this.blobby.getBlockByHash(params.blockhash)
    if (block) {
      return {
        status: HttpStatus.OK,
        message: `Found the block`,
        block
      }
    }
    return {
      status: HttpStatus.NOT_FOUND,
      message: `Hash is incorrect`,
      block: null
    }
  }

  @Get('/transaction/:transactionId')
  public async getBlockByTransactionId(@Param() params): Promise<TransactionResponseDto> {
    const response: TransactionSearchDto = this.blobby.getTransactionById(params.transactionId)
    if (response.transaction) {
      return {
        ...response,
        status: HttpStatus.OK,
        message: `Found the block`,
      }
    }
    return {
      status: HttpStatus.NOT_FOUND,
      message: `TransactionId is incorrect`,
      block: null,
      transaction: null
    }
  }

  @Get('/node/address/:addressId')
  public async getTransactionsByNodeAddress(@Param() params): Promise<AddressTransactionsDto> {
    const transactions: TransactionDto[] = this.blobby.getTransactionByAddress(params.addressId)
    const balance: number = this.blobby.calculateBalanceByAddress(params.addressId, transactions)
    if (transactions.length > 0) {
      return {
        status: HttpStatus.OK,
        message: `Transactions for ${params.addressId}`,
        transactions,
        balance
      }
    }
    return {
      status: HttpStatus.NOT_FOUND,
      message: `No transactions found for ${params.addressId}`,
      transactions,
      balance
    }
  }
}
