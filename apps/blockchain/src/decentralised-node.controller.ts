import { Controller } from '@nestjs/common'
import { v4 as uuidv4 } from 'uuid'
import { BlockchainService } from './blockchain.service'

const nodeId = uuidv4().split('-').join('')

@Controller('blobby')
export class DecentralisedNodeController {
  private readonly blobby: BlockchainService

  constructor() {
    this.blobby = new BlockchainService([], [])
  }


}
