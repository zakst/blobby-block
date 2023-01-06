import axios from 'axios'

export class RewardService {
  private readonly REWARD_VALUE_IN_COINS = 15
  private readonly DEFAULT_REWARD_SENDER = '00'
  async reward(nodeUrl: string, nodeId): Promise<void> {
    const endpoint = `${nodeUrl}/blobby/decentralised/transaction`
    await axios.post(endpoint, {
      amount: this.REWARD_VALUE_IN_COINS,
      sender: this.DEFAULT_REWARD_SENDER,
      receiver: nodeId
    })
  }
}
