import ResponseDto from './response.dto'
import TransactionDto from './transaction.dto'

export default class TransactionResponseDto extends ResponseDto {
  blockId: number

  transaction: TransactionDto
}
