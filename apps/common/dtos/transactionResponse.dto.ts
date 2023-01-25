import ResponseDto from '../../blockchain/src/dtos/response.dto'
import TransactionDto from '../../blockchain/src/dtos/transaction.dto'
import BlockDto from '../../blockchain/src/dtos/block.dto'

export default class TransactionResponseDto extends ResponseDto {
  block: BlockDto

  transaction: TransactionDto
}

export class TransactionSearchDto {
  block: BlockDto

  transaction: TransactionDto
}
