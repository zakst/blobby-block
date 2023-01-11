import BlockDto from './dtos/block.dto'
import TransactionDto from './dtos/transaction.dto'
import { sha256 } from 'js-sha256'
import { v4 as uuidv4 } from 'uuid'
import { TransactionSearchDto } from './dtos/transactionResponse.dto'

const port = process.env.PORT
const baseUrl = process.env.BASE_URL || 'http://localhost'

export class BlockchainService {
  public nodeUrl: string
  public blockchainNodes: string[]
  public chain: BlockDto[]
  public pendingTransactions: TransactionDto[]
  private readonly DEFAULT_NONCE: number = 5808
  private readonly DEFAULT_PREVIOUS_BLOCK_HASH: string = 'p_genesis_hash'
  private readonly DEFAULT_BLOCK_HASH: string = 'genesis_hash'
  private isInValid = (hash) => hash.substring(0, 4) !== '0000'
  private areHashesEqual = (blockPreviousHash, previousBlockHash) => blockPreviousHash === previousBlockHash

  constructor(chain: BlockDto[], transactions: TransactionDto[]) {
    this.chain = chain
    this.pendingTransactions = transactions
    this.createBlock(this.DEFAULT_NONCE, this.DEFAULT_PREVIOUS_BLOCK_HASH, this.DEFAULT_BLOCK_HASH)
    this.nodeUrl = `${baseUrl}:${port}`
    this.blockchainNodes = []
  }

  createBlock(nonce: number, previousBlockHash: string, hash: string): BlockDto {
    const block: BlockDto = {
      blockId: this.chain.length + 1,
      timestamp: Date.now(),
      transactions: this.pendingTransactions,
      nonce,
      hash,
      previousBlockHash,
    }
    this.pendingTransactions = []
    this.chain.push(block)
    return block
  }

  getChain(): BlockDto[] {
    return this.chain
  }

  getPendingTransactions(): TransactionDto[] {
    return this.pendingTransactions
  }

  getLastBlock(): BlockDto {
    return this.chain[this.chain.length - 1]
  }

  createTransaction(amount: number, sender: string, receiver: string): TransactionDto {
    return {
      amount,
      sender,
      receiver,
      transactionId: uuidv4().split('-').join('')
    }
  }

  queueTransaction(transaction: TransactionDto): number {
    this.pendingTransactions.push(transaction)
    return this.getLastBlock()['blockId'] + 1 // number of block the transaction will be added to
  }

  hashBlock(nonce: number, previousBlockHash: string, currentBlockData: TransactionDto[]): string {
    const data = `${previousBlockHash}${nonce.toString()}${JSON.stringify(currentBlockData)}`
    return sha256(data)
  }

  proofOfWork(previousBlockHash: string, currentBlockData: TransactionDto[]): number {
    let nonce: number = 0
    let hash = this.hashBlock(nonce, previousBlockHash, currentBlockData)
    while (this.isInValid(hash)) {
      nonce++
      hash = this.hashBlock(nonce, previousBlockHash, currentBlockData)
    }
    return nonce
  }

  mine(transactions: TransactionDto[]): BlockDto {
    const lastBlock = this.getLastBlock()
    const lastBlockHash = lastBlock.hash
    const currentBlockData: TransactionDto[] = transactions
    const nonce = this.proofOfWork(lastBlockHash, currentBlockData)
    const hash = this.hashBlock(nonce, lastBlockHash, currentBlockData)
    return this.createBlock(nonce, lastBlockHash, hash)
  }

  isChainValid(blocks: BlockDto[]): boolean {
    return blocks.every((block, index) => {
      if (index === 0) {
        return block.nonce === this.DEFAULT_NONCE
          && block.previousBlockHash === this.DEFAULT_PREVIOUS_BLOCK_HASH
          && block.hash === this.DEFAULT_BLOCK_HASH
          && block.transactions.length === 0
      }
      const previousBlock = blocks[index - 1]
      const hash = this.hashBlock(block.nonce, previousBlock.hash, block.transactions)
      const areHashesEqual = this.areHashesEqual(block.previousBlockHash, previousBlock.hash)
      const isInValidHash = this.isInValid(hash)
      return areHashesEqual && !isInValidHash
    })
  }

  getBlockByHash(blockHash: string): BlockDto {
    return this.chain.find(block => block.hash === blockHash)
  }

  getTransactionById(transactionId: string): TransactionSearchDto {
    let resultTransaction = null
    let resultBlock = null
    this.chain.forEach(block => {
      block.transactions.forEach(transaction => {
        if (transaction.transactionId === transactionId) {
          resultTransaction = transaction
          resultBlock = block
        }
      })
    })
    return {
      block: resultBlock,
      transaction: resultTransaction
    }
  }

  getTransactionByAddress(addressId: string): TransactionDto[] {
    let transactions: TransactionDto[] = []
    this.chain.forEach(block => {
      transactions = block.transactions.filter(transaction => {
        return transaction.sender === addressId || transaction.receiver === addressId
      })
    })
    return transactions
  }

  calculateBalanceByAddress(addressId: string, transactions: TransactionDto[]): number {
    let balance: number = 0
    transactions.forEach(transaction => {
      if (transaction.receiver === addressId) {
        balance += transaction.amount
      }
      if (transaction.sender === addressId) {
        balance -= transaction.amount
      }
    })
    return balance
  }
}
