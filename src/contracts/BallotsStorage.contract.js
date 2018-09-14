import Web3 from 'web3'
import { networkAddresses } from './addresses'
import helpers from './helpers'

export default class BallotsStorage {
  async init({ web3, netId }) {
    const { BALLOTS_STORAGE_ADDRESS } = networkAddresses(netId)
    console.log('Ballots Storage address', BALLOTS_STORAGE_ADDRESS)
    const web3_10 = new Web3(web3.currentProvider)
    const branch = helpers.getBranch(netId)

    const ballotsStorageAbi = await helpers.getABI(branch, 'BallotStorage')

    this.ballotsStorageInstance = new web3_10.eth.Contract(ballotsStorageAbi, BALLOTS_STORAGE_ADDRESS)
  }

  areKeysBallotParamsValid({ ballotType, affectedKeyType, affectedKey, miningKey }) {
    if (!this.ballotsStorageInstance.methods.areKeysBallotParamsValid) {
      return null
    }
    return this.ballotsStorageInstance.methods
      .areKeysBallotParamsValid(ballotType, affectedKeyType, affectedKey, miningKey)
      .call()
  }
}
