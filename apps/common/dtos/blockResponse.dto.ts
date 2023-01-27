import ResponseDto from '../../blockchain/src/dtos/response.dto'
import BlockDto from '../../blockchain/src/dtos/block.dto'

export default class BlockResponseDto extends ResponseDto {
  block: BlockDto
}
