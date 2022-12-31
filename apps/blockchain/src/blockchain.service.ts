import BlockDto from './dtos/block.dto'
import TransactionDto from './dtos/transaction.dto'
import { sha256 } from 'js-sha256'
const port = process.env.PORT
const baseUrl = process.env.BASE_URL || 'http://localhost'
export class BlockchainService {
  public readonly nodeUrl: string
  private readonly chain: BlockDto[]
  private pendingTransactions: TransactionDto[]
  private isInValid = (hash) => hash.substring(0, 4) !== '0000'
  constructor(chain: BlockDto[], transactions: TransactionDto[]) {
    this.chain = chain
    this.pendingTransactions = transactions
    this.createBlock(5808, 'genesis_hash', 'genesis_hash')
    this.nodeUrl = `${baseUrl}:${port}`
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
  queueTransaction(amount: number, sender: string, receiver: string): number {
    const transaction: TransactionDto = {
      amount,
      sender,
      receiver
    }
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
}
