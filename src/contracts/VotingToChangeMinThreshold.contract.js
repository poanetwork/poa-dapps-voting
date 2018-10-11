import { networkAddresses } from './addresses'
import helpers from './helpers'
import { constants } from '../constants'

export default class VotingToChangeMinThreshold {
  async init({ web3, netId }) {
    const { VOTING_TO_CHANGE_MIN_THRESHOLD_ADDRESS } = networkAddresses()
    console.log('VotingToChangeMinThreshold address', VOTING_TO_CHANGE_MIN_THRESHOLD_ADDRESS)

    const votingToChangeMinThresholdABI = await helpers.getABI(
      constants.NETWORKS[netId].BRANCH,
      'VotingToChangeMinThreshold'
    )

    this.instance = new web3.eth.Contract(votingToChangeMinThresholdABI, VOTING_TO_CHANGE_MIN_THRESHOLD_ADDRESS)
    this.address = VOTING_TO_CHANGE_MIN_THRESHOLD_ADDRESS
  }

  //setters
  createBallot({ startTime, endTime, proposedValue, memo }) {
    let method
    if (this.instance.methods.createBallot) {
      method = this.instance.methods.createBallot
    } else {
      method = this.instance.methods.createBallotToChangeThreshold
    }
    return method(startTime, endTime, proposedValue, memo).encodeABI()
  }

  vote(_id, choice) {
    return this.instance.methods.vote(_id, choice).encodeABI()
  }

  finalize(_id) {
    return this.instance.methods.finalize(_id).encodeABI()
  }

  //getters
  doesMethodExist(methodName) {
    if (this.instance.methods[methodName]) {
      return true
    }
    return false
  }

  nextBallotId() {
    return this.instance.methods.nextBallotId().call()
  }

  getBallotInfo(_id, _votingKey) {
    if (this.doesMethodExist('getBallotInfo')) {
      return this.instance.methods.getBallotInfo(_id, _votingKey).call()
    }
    return this.instance.methods.votingState(_id).call()
  }

  hasAlreadyVoted(_id, votingKey) {
    return this.instance.methods.hasAlreadyVoted(_id, votingKey).call()
  }

  isValidVote(_id, votingKey) {
    return this.instance.methods.isValidVote(_id, votingKey).call()
  }

  isActive(_id) {
    return this.instance.methods.isActive(_id).call()
  }

  canBeFinalizedNow(_id) {
    if (this.doesMethodExist('canBeFinalizedNow')) {
      return this.instance.methods.canBeFinalizedNow(_id).call()
    }
    return null
  }

  async getBallotLimit(_miningKey, _limitPerValidator) {
    const _activeBallots = await this.instance.methods.validatorActiveBallots(_miningKey).call()
    return _limitPerValidator - _activeBallots
  }
}
