import Web3 from 'web3'
import { networkAddresses } from './addresses'
import helpers from './helpers'

export default class ProxyStorage {
  async init({ web3, netId }) {
    const { PROXY_ADDRESS } = networkAddresses(netId)
    console.log('Proxy Storage address', PROXY_ADDRESS)
    const web3_10 = new Web3(web3.currentProvider)
    const branch = helpers.getBranch(netId)

    const proxyStorageAbi = await helpers.getABI(branch, 'ProxyStorage')

    this.proxyStorageInstance = new web3_10.eth.Contract(proxyStorageAbi, PROXY_ADDRESS)
  }

  doesMethodExist(methodName) {
    return this.proxyStorageInstance && this.proxyStorageInstance.methods[methodName]
  }
}
