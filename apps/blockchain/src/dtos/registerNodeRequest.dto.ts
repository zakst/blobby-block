import { MinLength } from 'class-validator'

export default class RegisterNodeRequestDto {
  @MinLength(10)
  nodeUrl: string
}
