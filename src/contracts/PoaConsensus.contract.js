import { networkAddresses } from './addresses'
import helpers from './helpers'
import { constants } from '../constants'

export default class PoaConsensus {
  async init({ web3, netId }) {
    const { POA_ADDRESS } = networkAddresses()
    console.log('POA address', POA_ADDRESS)

    const poaConsensusAbi = await helpers.getABI(constants.NETWORKS[netId].BRANCH, 'PoaNetworkConsensus')

    this.instance = new web3.eth.Contract(poaConsensusAbi, POA_ADDRESS)
  }

  async getValidators() {
    return await this.instance.methods.getValidators().call()
  }
}
