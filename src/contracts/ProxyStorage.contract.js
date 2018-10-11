import Web3 from 'web3'
import { networkAddresses } from './addresses'
import helpers from './helpers'
import { constants } from '../constants'

export default class ProxyStorage {
  async init({ web3, netId }) {
    const { PROXY_ADDRESS } = networkAddresses()
    console.log('Proxy Storage address', PROXY_ADDRESS)
    const web3_10 = new Web3(web3.currentProvider)

    const proxyStorageAbi = await helpers.getABI(constants.NETWORKS[netId].BRANCH, 'ProxyStorage')

    this.proxyStorageInstance = new web3_10.eth.Contract(proxyStorageAbi, PROXY_ADDRESS)
  }

  doesMethodExist(methodName) {
    return this.proxyStorageInstance && this.proxyStorageInstance.methods[methodName]
  }
}
