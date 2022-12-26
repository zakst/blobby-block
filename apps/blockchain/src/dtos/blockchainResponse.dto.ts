import ResponseDto from './response.dto'
import { BlockchainService } from '../blockchain.service'

export default class BlockchainResponseDto extends ResponseDto {
  blockchain: BlockchainService
}
