import { BlockchainService } from './blockchain.service'
import TransactionDto from './dtos/transaction.dto'

describe('BlockchainService', () => {
  describe('mineBlock', () => {
    it('should return a new block with with expected properties', () => {
      const service = new BlockchainService([], [])
      const result = service.mineBlock(58085808, 'previous_hash', 'current_hash')
      expect(result).toHaveProperty('timestamp')
      expect(result).toHaveProperty('index')
      expect(result).toHaveProperty('transactions')
    })
  })
  describe('queueTransaction', () => {
    it('should mine two blocks with the second in the chain having an amount of 12.88', () => {
      const service = new BlockchainService([], [])
      service.mineBlock(58085808, 'previous_hash', 'current_hash')
      service.queueTransaction(12.88, 'sender_address', 'receiver_address')
      service.mineBlock(108734, 'previous_hash', 'current_hash')
      expect(service.getChain()[1].transactions[0].amount).toEqual(12.88)
    })
    it('should mine two blocks and have 3 pending transactions', () => {
      const service = new BlockchainService([], [])
      service.mineBlock(58085808, 'previous_hash', 'current_hash')
      service.queueTransaction(15.98, 'sender_address', 'receiver_address')
      service.mineBlock(108734, 'previous_hash', 'current_hash')
      service.queueTransaction(11, 'sender_address', 'receiver_address')
      service.queueTransaction(4987, 'sender_address', 'receiver_address')
      service.queueTransaction(2187, 'sender_address', 'receiver_address')
      expect(service.getChain().length).toEqual(2)
      expect(service.getPendingTransactions().length).toEqual(3)
    })
    it('should mine three blocks and have 0 pending transactions', () => {
      const service = new BlockchainService([], [])
      service.mineBlock(12345, 'previous_hash', 'current_hash')
      service.queueTransaction(454.98, 'sender_address', 'receiver_address')
      service.mineBlock(10873422, 'previous_hash', 'current_hash')
      service.queueTransaction(8984, 'sender_address', 'receiver_address')
      service.queueTransaction(3, 'sender_address', 'receiver_address')
      service.queueTransaction(5.8, 'sender_address', 'receiver_address')
      service.mineBlock(788017, 'previous_hash', 'current_hash')
      expect(service.getChain().length).toEqual(3)
      expect(service.getPendingTransactions().length).toEqual(0)
    })
  })
  describe('hashBlock', () => {
    it('should return the hash for blobby-block', () => {
      const service = new BlockchainService([], [])
      const currentData: TransactionDto[] = [
        {
          amount: 12,
          sender: 'sender_address',
          receiver: 'receiver_address'
        }
      ]
      const result = service.hashBlock(58085808, 'previous_hash', currentData)
      expect(result).toEqual('e5b7263db3770c8e986dca5bd205d10f92e1ff9c0fc8277b20a04ab77ffc6475')
    })
  })
  describe('proofOfWork', () => {
    
  })
})
