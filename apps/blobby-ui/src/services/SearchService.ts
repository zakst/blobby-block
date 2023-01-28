import TransactionResponseDto from '../dtos/transactionResponse.dto'
import axios, { AxiosResponse } from 'axios'
import BlockResponseDto from '../dtos/blockResponse.dto'
import AddressTransactionsDto from '../dtos/addressTransactions.dto'

const BASE_URL = process.env.REACT_APP_BASE_URL

export const getByTransactionId = async (transactionId: string): Promise<TransactionResponseDto> => {
  const endpoint = `${BASE_URL}/blobby/transaction/${transactionId}`
  const response: AxiosResponse = await axios.get(endpoint)
  return response.data
}

export const getByBlockHash = async (blockhash: string): Promise<BlockResponseDto> => {
  const endpoint = `${BASE_URL}/blobby/block/${blockhash}`
  const response: AxiosResponse = await axios.get(endpoint)
  return response.data
}

export const getByNodeAddress = async (address: string): Promise<AddressTransactionsDto> => {
  const endpoint = `${BASE_URL}/blobby/node/address/${address}`
  const response: AxiosResponse = await axios.get(endpoint)
  return response.data
}
