import ResponseDto from './response.dto'
import TransactionDto from './transaction.dto'

export default class AddressTransactionsDto extends ResponseDto {
  transactions: TransactionDto[]
  balance: number
}
