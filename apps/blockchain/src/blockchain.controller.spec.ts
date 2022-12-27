import { Test, TestingModule } from '@nestjs/testing'
import { BlockchainController } from './blockchain.controller'
import { BlockchainService } from './blockchain.service'
import { raw } from 'express'
import { ArgumentMetadata, ValidationPipe } from '@nestjs/common'
import TransactionDto from './dtos/transaction.dto'

describe('BlockchainController', () => {
  let blockchainController: BlockchainController

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [BlockchainController],
    }).compile()

    blockchainController = app.get<BlockchainController>(BlockchainController)
  });

  describe('getBlockChain', () => {
    it('should return the block chain in full', () => {
      const blobby = new BlockchainService([], [])
      expect(blobby.getChain().length).toEqual(1)
      expect(blobby.getPendingTransactions().length).toEqual(0)
    })
  })
  describe('createTransaction', () => {
    describe('when call is successful', () => {
      it('should queue a transaction and return a successful response', async () => {
        new BlockchainService([], [])
        const expectedResponse = {
          status: 200,
          message: 'Transaction queued successfully',
          blockId: 2,
          transaction: {
            amount: 12,
            sender: 'DLFKDKKDKDKDK334343',
            receiver: 'EEEOEMFLSKJL2323'
          }
        }
        const response = await blockchainController.createTransaction({
          amount: 12,
          sender: 'DLFKDKKDKDKDK334343',
          receiver: 'EEEOEMFLSKJL2323'
        })
        expect(response).toEqual(expectedResponse)
      })
    })
    describe('when a bad request is sent', () => {
      it('should return a 400 bad request', async () => {
        new BlockchainService([], [])
        let target: ValidationPipe = new ValidationPipe({ transform: true });
        const metadata: ArgumentMetadata = {
          type: 'body',
          metatype: TransactionDto,
          data: ''
        }
        await target.transform(<TransactionDto>{
          amount: 12,
          sender: 'DLFKDKKDKDKDK334343'
        }, metadata)
          .catch(err => {
            expect(err.getResponse().message).toEqual(["receiver must be longer than or equal to 10 characters"])
            expect(err.getResponse().statusCode).toEqual(400)
            expect(err.getResponse().error).toEqual("Bad Request")
          })
      })
    })
  })
})
