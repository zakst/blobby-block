import { Injectable } from '@nestjs/common';
import BlockDto from './dtos/block.dto'
import TransactionDto from './dtos/transaction.dto'

@Injectable()
export class BlockchainService {
  private chain: BlockDto[]
  private pendingTransactions: TransactionDto[]
  constructor(chain: BlockDto[], transactions: TransactionDto[]) {
    this.chain = chain
    this.pendingTransactions = transactions
  }
  mineBlock(nonce: number, previousBlockHash: string, hash: string): BlockDto {
    const block: BlockDto = {
      index: this.chain.length + 1,
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
    return this.getLastBlock()['index'] + 1 // number of block the transaction will be added to
  }

}
