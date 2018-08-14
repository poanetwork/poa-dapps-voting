import Web3 from 'web3'
import { networkAddresses } from './addresses'
import helpers from './helpers'

export default class VotingToChangeMinThreshold {
  async init({ web3, netId }) {
    const { VOTING_TO_CHANGE_MIN_THRESHOLD_ADDRESS } = networkAddresses(netId)
    console.log('VotingToChangeMinThreshold address', VOTING_TO_CHANGE_MIN_THRESHOLD_ADDRESS)
    const web3_10 = new Web3(web3.currentProvider)

    const branch = helpers.getBranch(netId)

    const votingToChangeMinThresholdABI = await helpers.getABI(branch, 'VotingToChangeMinThreshold')

    this.votingToChangeMinThresholdInstance = new web3_10.eth.Contract(
      votingToChangeMinThresholdABI,
      VOTING_TO_CHANGE_MIN_THRESHOLD_ADDRESS
    )
    this.gasPrice = web3_10.utils.toWei('1', 'gwei')
    this.address = VOTING_TO_CHANGE_MIN_THRESHOLD_ADDRESS
    this.instance = this.votingToChangeMinThresholdInstance
  }

  //setters
  createBallot({ startTime, endTime, proposedValue, memo }) {
    let method
    if (this.votingToChangeMinThresholdInstance.methods.createBallot) {
      method = this.votingToChangeMinThresholdInstance.methods.createBallot
    } else {
      method = this.votingToChangeMinThresholdInstance.methods.createBallotToChangeThreshold
    }
    return method(startTime, endTime, proposedValue, memo).encodeABI()
  }

  vote(_id, choice) {
    return this.votingToChangeMinThresholdInstance.methods.vote(_id, choice).encodeABI()
  }

  finalize(_id) {
    return this.votingToChangeMinThresholdInstance.methods.finalize(_id).encodeABI()
  }

  //getters
  doesMethodExist(methodName) {
    if (this.votingToChangeMinThresholdInstance.methods[methodName]) {
      return true
    }
    return false
  }

  nextBallotId() {
    return this.votingToChangeMinThresholdInstance.methods.nextBallotId().call()
  }

  getBallotInfo(_id, _votingKey) {
    if (this.doesMethodExist('getBallotInfo')) {
      return this.votingToChangeMinThresholdInstance.methods.getBallotInfo(_id, _votingKey).call()
    }
    return this.votingToChangeMinThresholdInstance.methods.votingState(_id).call()
  }

  hasAlreadyVoted(_id, votingKey) {
    return this.votingToChangeMinThresholdInstance.methods.hasAlreadyVoted(_id, votingKey).call()
  }

  isValidVote(_id, votingKey) {
    return this.votingToChangeMinThresholdInstance.methods.isValidVote(_id, votingKey).call()
  }

  isActive(_id) {
    return this.votingToChangeMinThresholdInstance.methods.isActive(_id).call()
  }

  canBeFinalizedNow(_id) {
    if (this.doesMethodExist('canBeFinalizedNow')) {
      return this.votingToChangeMinThresholdInstance.methods.canBeFinalizedNow(_id).call()
    }
    return null
  }

  async getBallotLimit(_miningKey, _limitPerValidator) {
    const _activeBallots = await this.votingToChangeMinThresholdInstance.methods
      .validatorActiveBallots(_miningKey)
      .call()
    return _limitPerValidator - _activeBallots
  }
}
