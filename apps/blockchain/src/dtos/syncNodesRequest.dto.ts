import { IsArray, MinLength } from 'class-validator'

export default class SyncNodesRequestDto {
  @IsArray()
  @MinLength(1)
  nodeUrls: string[]
}
