import { networkAddresses } from './addresses'

export default class EmissionFunds {
  async init({ web3, netId }) {
    const { EMISSION_FUNDS_ADDRESS } = networkAddresses()
    console.log('EmissionFunds address', EMISSION_FUNDS_ADDRESS)
    this.web3 = web3
    this.address = EMISSION_FUNDS_ADDRESS
  }

  balance() {
    return this.web3.eth.getBalance(this.address)
  }
}
