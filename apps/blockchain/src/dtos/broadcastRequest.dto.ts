import { MinLength } from 'class-validator'

export default class BroadcastRequestDto {
  @MinLength(10)
  nodeUrl: string
}
