import ResponseDto from './response.dto'
import BlockDto from './block.dto'

export default class ConsensusResponseDto extends ResponseDto {
  chain: BlockDto[]
}
