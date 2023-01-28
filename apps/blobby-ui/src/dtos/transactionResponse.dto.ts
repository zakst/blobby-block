import ResponseDto from './response.dto'
import TransactionDto from './transaction.dto'
import BlockDto from './block.dto'

export default class TransactionResponseDto extends ResponseDto {
  block: BlockDto

  transaction: TransactionDto
}
