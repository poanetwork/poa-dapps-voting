import Web3 from 'web3'
import { networkAddresses } from './addresses'
import helpers from './helpers'
import { constants } from '../constants'

export default class PoaConsensus {
  async init({ web3, netId }) {
    const { POA_ADDRESS } = networkAddresses()
    console.log('POA address', POA_ADDRESS)
    const web3_10 = new Web3(web3.currentProvider)

    const poaConsensusAbi = await helpers.getABI(constants.NETWORKS[netId].BRANCH, 'PoaNetworkConsensus')

    this.poaInstance = new web3_10.eth.Contract(poaConsensusAbi, POA_ADDRESS)
  }

  async getValidators() {
    return await this.poaInstance.methods.getValidators().call()
  }
}
