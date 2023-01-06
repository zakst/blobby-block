import { BlockchainService } from './blockchain.service'
import TransactionDto from './dtos/transaction.dto'
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'random-uuid'),
}))

describe('BlockchainService', () => {
  describe('createBlock', () => {
    it('should return a new block with with expected properties', () => {
      const service = new BlockchainService([], [])
      const result = service.createBlock(58085808, 'previous_hash', 'current_hash')
      expect(result).toHaveProperty('timestamp')
      expect(result).toHaveProperty('blockId')
      expect(result).toHaveProperty('transactions')
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
  describe('queueTransaction', () => {
    it('should queue transaction and return number of block the transaction will be added to', () => {
      const service = new BlockchainService([], [])
      const sampleTransactions: TransactionDto =
        {
          amount: 12,
          sender: 'sender_address',
          receiver: 'receiver_address'
        }

      const result = service.queueTransaction(sampleTransactions)
      expect(result).toEqual(2)
    })
  })
  describe('createTransaction', () => {
    it('should create a transaction', () => {
      const service = new BlockchainService([], [])
      service.createBlock(58085808, 'previous_hash', 'current_hash')
      const result = service.createTransaction(15.98, 'sender_address', 'receiver_address')
      const expectedResult = {
          amount: 15.98,
          sender: 'sender_address',
          receiver: 'receiver_address',
          transactionId: 'randomuuid'
        }
      expect(result).toEqual(expectedResult)
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
      expect(result.nonce).toEqual(26104)
      expect(result).toHaveProperty('previousBlockHash')
      expect(result).toHaveProperty('timestamp')
      expect(result).toHaveProperty('transactions')
      expect(result.transactions.length).toEqual(0)
    })
  })
  describe('isChainValid', () => {
    describe('on success', () => {
      describe('of first block', () => {
        it('should return true as the first block is valid', () => {
          const service = new BlockchainService([], [])
          const result = service.isChainValid(service.chain)
          expect(result).toBeTruthy()
        })
      })
      describe('of more blocks', () => {
        it('should return true as the entire chain is valid', () => {
          const service = new BlockchainService([], [])
          service.createBlock(26104, 'genesis_hash', 'current_hash_121')
          service.createBlock(144300, 'current_hash_121', 'current_hash_4456')
          const result = service.isChainValid(service.chain)
          expect(result).toBeTruthy()
        })
      })
    })
    describe('on failure', () => {
      describe('of first block', () => {
        it('should return false as the first block is invalid', () => {
          const service = new BlockchainService([], [])
          service.chain[0].previousBlockHash = 'FAKE_HASH'
          const result = service.isChainValid(service.chain)
          expect(result).toBeFalsy()
        })
      })
      describe('of more blocks', () => {
        it('should return false as one of the blocks contains an invalid nonce', () => {
          const service = new BlockchainService([], [])
          service.createBlock(26104, 'genesis_hash', 'current_hash_121')
          service.createBlock(12567, 'current_hash_121', 'current_hash_4456')
          const result = service.isChainValid(service.chain)
          expect(result).toBeFalsy()
        })
        it('should return true as of the blocks contains an invalid previous hash', () => {
          const service = new BlockchainService([], [])
          service.createBlock(26104, 'genesis_hash', 'current_hash_121')
          service.createBlock(144300, 'current_hah_121', 'current_hash_4456')
          const result = service.isChainValid(service.chain)
          expect(result).toBeFalsy()
        })
        it('should return true as of the blocks contains an invalid hash', () => {
          const service = new BlockchainService([], [])
          service.createBlock(26104, 'genesis_hash', 'current_hash__121')
          service.createBlock(144300, 'current_hah_121', 'current_hash_4456')
          const result = service.isChainValid(service.chain)
          expect(result).toBeFalsy()
        })
      })
    })
  })
})
