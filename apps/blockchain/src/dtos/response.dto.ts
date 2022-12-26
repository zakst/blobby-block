import { HttpStatus } from '@nestjs/common'

export default class ResponseDto {
  status: number
  message: string
  errors?: any = ''
}
