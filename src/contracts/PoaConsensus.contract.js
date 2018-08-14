import Web3 from 'web3'
import { networkAddresses } from './addresses'
import helpers from './helpers'

export default class POAConsensus {
  async init({ web3, netId }) {
    const { POA_ADDRESS } = networkAddresses(netId)
    console.log('POA address', POA_ADDRESS)
    const web3_10 = new Web3(web3.currentProvider)

    const branch = helpers.getBranch(netId)

    const poaConsensusAbi = await helpers.getABI(branch, 'PoaNetworkConsensus')

    this.poaInstance = new web3_10.eth.Contract(poaConsensusAbi, POA_ADDRESS)
  }

  async getValidators() {
    return await this.poaInstance.methods.getValidators().call()
  }
}
