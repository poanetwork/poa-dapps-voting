import { networkAddresses } from './addresses'
import helpers from './helpers'
import { constants } from '../constants'

export default class VotingToChangeKeys {
  async init({ web3, netId }) {
    const { VOTING_TO_CHANGE_KEYS_ADDRESS } = networkAddresses()
    console.log('VotingToChangeKeys address', VOTING_TO_CHANGE_KEYS_ADDRESS)

    const votingToChangeKeysABI = await helpers.getABI(constants.NETWORKS[netId].BRANCH, 'VotingToChangeKeys')

    this.instance = new web3.eth.Contract(votingToChangeKeysABI, VOTING_TO_CHANGE_KEYS_ADDRESS)
    this.address = VOTING_TO_CHANGE_KEYS_ADDRESS
  }

  //setters
  createBallot({ startTime, endTime, affectedKey, affectedKeyType, miningKey, ballotType, memo }) {
    if (this.instance.methods.createBallot) {
      return this.instance.methods
        .createBallot(startTime, endTime, ballotType, affectedKeyType, memo, affectedKey, miningKey)
        .encodeABI()
    }
    return this.instance.methods
      .createVotingForKeys(startTime, endTime, affectedKey, affectedKeyType, miningKey, ballotType, memo)
      .encodeABI()
  }

  createBallotToAddNewValidator({ startTime, endTime, memo, affectedKey, newVotingKey, newPayoutKey }) {
    return this.instance.methods
      .createBallotToAddNewValidator(startTime, endTime, memo, affectedKey, newVotingKey, newPayoutKey)
      .encodeABI()
  }

  vote(_id, choice) {
    return this.instance.methods.vote(_id, choice).encodeABI()
  }

  finalize(_id) {
    return this.instance.methods.finalize(_id).encodeABI()
  }

  //getters
  areBallotParamsValid({ ballotType, affectedKey, affectedKeyType, miningKey }) {
    if (!this.doesMethodExist('areBallotParamsValid')) {
      return null
    }
    return this.instance.methods.areBallotParamsValid(ballotType, affectedKey, affectedKeyType, miningKey).call()
  }

  doesMethodExist(methodName) {
    return this.instance && this.instance.methods[methodName]
  }

  nextBallotId() {
    return this.instance.methods.nextBallotId().call()
  }

  getBallotInfo(_id, _votingKey) {
    if (this.doesMethodExist('getBallotInfo')) {
      return this.instance.methods.getBallotInfo(_id).call()
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
