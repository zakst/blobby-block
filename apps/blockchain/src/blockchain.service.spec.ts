import { BlockchainService } from './blockchain.service'
import TransactionDto from './dtos/transaction.dto'

describe('BlockchainService', () => {
  describe('createBlock', () => {
    it('should return a new block with with expected properties', () => {
      const service = new BlockchainService([], [])
      const result = service.createBlock(58085808, 'previous_hash', 'current_hash')
      expect(result).toHaveProperty('timestamp')
      expect(result).toHaveProperty('blockId')
      expect(result).toHaveProperty('transactions')
    })
  })
  describe('queueTransaction', () => {
    it('should create two blocks with the third in the chain having an amount of 12.88', () => {
      const service = new BlockchainService([], [])
      service.createBlock(58085808, 'previous_hash', 'current_hash')
      service.createTransaction(12.88, 'sender_address', 'receiver_address')
      service.createBlock(108734, 'previous_hash', 'current_hash')
      expect(service.getChain()[2].transactions[0].amount).toEqual(12.88)
    })
    it('should create two blocks not to forget the genesis block and have 3 pending transactions', () => {
      const service = new BlockchainService([], [])
      service.createBlock(58085808, 'previous_hash', 'current_hash')
      service.createTransaction(15.98, 'sender_address', 'receiver_address')
      service.createBlock(108734, 'previous_hash', 'current_hash')
      service.createTransaction(11, 'sender_address', 'receiver_address')
      service.createTransaction(4987, 'sender_address', 'receiver_address')
      service.createTransaction(2187, 'sender_address', 'receiver_address')
      expect(service.getChain().length).toEqual(3)
      expect(service.getPendingTransactions().length).toEqual(3)
    })
    it('should create three blocks not to forget the genesis block and have 0 pending transactions', () => {
      const service = new BlockchainService([], [])
      service.createBlock(12345, 'previous_hash', 'current_hash')
      service.createTransaction(454.98, 'sender_address', 'receiver_address')
      service.createBlock(10873422, 'previous_hash', 'current_hash')
      service.createTransaction(8984, 'sender_address', 'receiver_address')
      service.createTransaction(3, 'sender_address', 'receiver_address')
      service.createTransaction(5.8, 'sender_address', 'receiver_address')
      service.createBlock(788017, 'previous_hash', 'current_hash')
      expect(service.getChain().length).toEqual(4)
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
    it('should return the nonce as the proof of work', () => {
      const service = new BlockchainService([], [])
      const currentData: TransactionDto[] = [
        {
          amount: 12,
          sender: 'sender_address',
          receiver: 'receiver_address'
        }
      ]
      const result = service.proofOfWork('previous_hash', currentData)
      expect(result).toEqual(60717)
    })
  })
  describe('mine', () => {
    it('should return the mined block for the genesis block', () => {
      const service = new BlockchainService([], [])
      const result = service.mine(service.getPendingTransactions())
      expect(result).toHaveProperty('blockId')
      expect(result).toHaveProperty('hash')
      expect(result).toHaveProperty('nonce')
      expect(result).toHaveProperty('previousBlockHash')
      expect(result).toHaveProperty('timestamp')
      expect(result).toHaveProperty('transactions')
      expect(result.transactions.length).toEqual(0)
    })
  })
})
