import Web3 from 'web3'
import { networkAddresses } from './addresses'
import helpers from './helpers'

export default class VotingToChangeKeys {
  async init({ web3, netId }) {
    const { VOTING_TO_CHANGE_KEYS_ADDRESS } = networkAddresses(netId)
    console.log('VotingToChangeKeys address', VOTING_TO_CHANGE_KEYS_ADDRESS)
    let web3_10 = new Web3(web3.currentProvider)

    const branch = helpers.getBranch(netId)

    let votingToChangeKeysABI = await helpers.getABI(branch, 'VotingToChangeKeys')

    this.votingToChangeKeysInstance = new web3_10.eth.Contract(votingToChangeKeysABI, VOTING_TO_CHANGE_KEYS_ADDRESS)
    this.gasPrice = web3_10.utils.toWei('1', 'gwei')
    this.address = VOTING_TO_CHANGE_KEYS_ADDRESS
  }

  //setters
  createBallot({ startTime, endTime, affectedKey, affectedKeyType, miningKey, ballotType, memo }) {
    let method
    if (this.votingToChangeKeysInstance.methods.createBallot) {
      method = this.votingToChangeKeysInstance.methods.createBallot
    } else {
      method = this.votingToChangeKeysInstance.methods.createVotingForKeys
    }
    return method(startTime, endTime, affectedKey, affectedKeyType, miningKey, ballotType, memo).encodeABI()
  }

  createBallotToAddNewValidator({ startTime, endTime, affectedKey, newVotingKey, newPayoutKey, memo }) {
    return this.votingToChangeKeysInstance.methods
      .createBallotToAddNewValidator(startTime, endTime, affectedKey, newVotingKey, newPayoutKey, memo)
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

  getMiningByVotingKey(_votingKey) {
    return this.votingToChangeKeysInstance.methods.getMiningByVotingKey(_votingKey).call()
  }

  async getValidatorActiveBallots(_votingKey) {
    let miningKey
    try {
      miningKey = await this.getMiningByVotingKey(_votingKey)
    } catch (e) {
      miningKey = '0x0000000000000000000000000000000000000000'
    }
    return await this.votingToChangeKeysInstance.methods.validatorActiveBallots(miningKey).call()
  }

  async getBallotLimit(_votingKey) {
    const currentLimit = await this.votingToChangeKeysInstance.methods.getBallotLimitPerValidator().call()
    return currentLimit - (await this.getValidatorActiveBallots(_votingKey))
  }
}
