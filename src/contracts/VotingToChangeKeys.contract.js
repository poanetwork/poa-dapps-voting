import Web3 from 'web3'
import { networkAddresses } from './addresses'
import helpers from './helpers'

export default class VotingToChangeKeys {
  async init({ web3, netId }) {
    const { VOTING_TO_CHANGE_KEYS_ADDRESS } = networkAddresses(netId)
    console.log('VotingToChangeKeys address', VOTING_TO_CHANGE_KEYS_ADDRESS)
    const web3_10 = new Web3(web3.currentProvider)

    const branch = helpers.getBranch(netId)

    const votingToChangeKeysABI = await helpers.getABI(branch, 'VotingToChangeKeys')

    this.votingToChangeKeysInstance = new web3_10.eth.Contract(votingToChangeKeysABI, VOTING_TO_CHANGE_KEYS_ADDRESS)
    this.gasPrice = web3_10.utils.toWei('1', 'gwei')
    this.address = VOTING_TO_CHANGE_KEYS_ADDRESS
    this.instance = this.votingToChangeKeysInstance
  }

  //setters
  createBallot({ startTime, endTime, affectedKey, affectedKeyType, miningKey, ballotType, memo }) {
    if (this.votingToChangeKeysInstance.methods.createBallot) {
      return this.votingToChangeKeysInstance.methods
        .createBallot(startTime, endTime, ballotType, affectedKeyType, memo, affectedKey, miningKey)
        .encodeABI()
    }
    return this.votingToChangeKeysInstance.methods
      .createVotingForKeys(startTime, endTime, affectedKey, affectedKeyType, miningKey, ballotType, memo)
      .encodeABI()
  }

  createBallotToAddNewValidator({ startTime, endTime, memo, affectedKey, newVotingKey, newPayoutKey }) {
    return this.votingToChangeKeysInstance.methods
      .createBallotToAddNewValidator(startTime, endTime, memo, affectedKey, newVotingKey, newPayoutKey)
      .encodeABI()
  }

  vote(_id, choice) {
    return this.votingToChangeKeysInstance.methods.vote(_id, choice).encodeABI()
  }

  finalize(_id) {
    return this.votingToChangeKeysInstance.methods.finalize(_id).encodeABI()
  }

  //getters
  areBallotParamsValid({ ballotType, affectedKey, affectedKeyType, miningKey }) {
    if (!this.doesMethodExist('areBallotParamsValid')) {
      return null
    }
    return this.votingToChangeKeysInstance.methods
      .areBallotParamsValid(ballotType, affectedKey, affectedKeyType, miningKey)
      .call()
  }

  doesMethodExist(methodName) {
    return this.votingToChangeKeysInstance && this.votingToChangeKeysInstance.methods[methodName]
  }

  nextBallotId() {
    return this.votingToChangeKeysInstance.methods.nextBallotId().call()
  }

  getBallotInfo(_id, _votingKey) {
    if (this.doesMethodExist('getBallotInfo')) {
      return this.votingToChangeKeysInstance.methods.getBallotInfo(_id).call()
    }
    return this.votingToChangeKeysInstance.methods.votingState(_id).call()
  }

  hasAlreadyVoted(_id, votingKey) {
    return this.votingToChangeKeysInstance.methods.hasAlreadyVoted(_id, votingKey).call()
  }

  isValidVote(_id, votingKey) {
    return this.votingToChangeKeysInstance.methods.isValidVote(_id, votingKey).call()
  }

  isActive(_id) {
    return this.votingToChangeKeysInstance.methods.isActive(_id).call()
  }

  canBeFinalizedNow(_id) {
    if (this.doesMethodExist('canBeFinalizedNow')) {
      return this.votingToChangeKeysInstance.methods.canBeFinalizedNow(_id).call()
    }
    return null
  }

  async getBallotLimit(_miningKey, _limitPerValidator) {
    const _activeBallots = await this.votingToChangeKeysInstance.methods.validatorActiveBallots(_miningKey).call()
    return _limitPerValidator - _activeBallots
  }
}
