import { IsArray, MinLength } from 'class-validator'

export default class SyncNodesRequestDto {
  @IsArray()
  nodeUrls: string[]
}
