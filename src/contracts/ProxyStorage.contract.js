import { networkAddresses } from './addresses'
import helpers from './helpers'
import { constants } from '../constants'

export default class ProxyStorage {
  async init({ web3, netId }) {
    const { PROXY_ADDRESS } = networkAddresses()
    console.log('Proxy Storage address', PROXY_ADDRESS)

    const proxyStorageAbi = await helpers.getABI(constants.NETWORKS[netId].BRANCH, 'ProxyStorage')

    this.instance = new web3.eth.Contract(proxyStorageAbi, PROXY_ADDRESS)
  }

  doesMethodExist(methodName) {
    return this.instance && this.instance.methods[methodName]
  }
}
