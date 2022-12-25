import TransactionDto from './transaction.dto'

export default class BlockDto {
  blockId: number
  timestamp: number
  nonce: number
  hash: string
  previousBlockHash: string
  transactions: TransactionDto[]
}
