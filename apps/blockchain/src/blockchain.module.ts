import { Module } from '@nestjs/common'
import { BlockchainController } from './blockchain.controller'
import { DecentralisedNodeController } from './decentralised-node.controller'

@Module({
  imports: [],
  controllers: [BlockchainController, DecentralisedNodeController],
  providers: [],
})
export class BlockchainModule {}
