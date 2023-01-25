import TransactionResponseDto from '../../../common/dtos/transactionResponse.dto'
import axios, { AxiosResponse } from 'axios'
const BASE_URL = process.env.REACT_APP_BASE_URL
export default class SearchService {
  async getByTransactionId(transactionId: string): Promise<TransactionResponseDto> {
    const endpoint = `${BASE_URL}/blobby/transaction/${transactionId}`
    const response: AxiosResponse = await axios.get(endpoint)
    return response.data
  }
}
