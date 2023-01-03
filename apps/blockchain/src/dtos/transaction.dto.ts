import { IsNumber, IsPositive, MinLength } from 'class-validator'

export default class TransactionDto {
  @IsNumber()
  @IsPositive()
  amount: number

  @MinLength(2)
  sender: string

  @MinLength(10)
  receiver: string
  transactionId?: string
}
