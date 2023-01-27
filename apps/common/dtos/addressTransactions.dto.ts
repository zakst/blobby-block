import ResponseDto from '../../blockchain/src/dtos/response.dto'
import TransactionDto from '../../blockchain/src/dtos/transaction.dto'

export default class AddressTransactionsDto extends ResponseDto {
  transactions: TransactionDto[]
  balance: number
}
