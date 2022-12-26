import ResponseDto from './response.dto'
import BlockDto from './block.dto'

export default class MinedBlockResponseDto extends ResponseDto {
  block: BlockDto
}
