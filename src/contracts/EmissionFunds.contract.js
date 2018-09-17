import Web3 from 'web3'
import { networkAddresses } from './addresses'

export default class EmissionFunds {
  async init({ web3, netId }) {
    const { EMISSION_FUNDS_ADDRESS } = networkAddresses(netId)
    console.log('EmissionFunds address', EMISSION_FUNDS_ADDRESS)
    this.web3_10 = new Web3(web3.currentProvider)
    this.address = EMISSION_FUNDS_ADDRESS
  }

  balance() {
    return this.web3_10.eth.getBalance(this.address)
  }
}
