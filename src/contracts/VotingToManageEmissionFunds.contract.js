import Web3 from 'web3'
import { networkAddresses } from './addresses'
import helpers from './helpers'

export default class VotingToManageEmissionFunds {
  async init({ web3, netId }) {
    const { VOTING_TO_MANAGE_EMISSION_FUNDS_ADDRESS } = networkAddresses(netId)
    console.log('VotingToManageEmissionFunds address', VOTING_TO_MANAGE_EMISSION_FUNDS_ADDRESS)
    const web3_10 = new Web3(web3.currentProvider)

    const branch = helpers.getBranch(netId)

    const votingToManageEmissionFundsABI = await helpers.getABI(branch, 'VotingToManageEmissionFunds')

    this.instance = new web3_10.eth.Contract(votingToManageEmissionFundsABI, VOTING_TO_MANAGE_EMISSION_FUNDS_ADDRESS)
    this.address = VOTING_TO_MANAGE_EMISSION_FUNDS_ADDRESS
  }

  // setters
  cancelBallot(_id) {
    return this.instance.methods.cancelNewBallot().encodeABI()
  }

  createBallot({ startTime, endTime, receiver, memo }) {
    return this.instance.methods.createBallot(startTime, endTime, receiver, memo).encodeABI()
  }

  finalize(_id) {
    return this.instance.methods.finalize(_id).encodeABI()
  }

  vote(_id, choice) {
    return this.instance.methods.vote(_id, choice).encodeABI()
  }

  // getters
  ballotCancelingThreshold() {
    return this.instance.methods.ballotCancelingThreshold().call()
  }

  canBeFinalizedNow(_id) {
    return this.instance.methods.canBeFinalizedNow(_id).call()
  }

  distributionThreshold() {
    return this.instance.methods.distributionThreshold().call()
  }

  emissionReleaseThreshold() {
    return this.instance.methods.emissionReleaseThreshold().call()
  }

  emissionReleaseTime() {
    return this.instance.methods.emissionReleaseTime().call()
  }

  refreshEmissionReleaseTime(emissionReleaseTime, emissionReleaseThreshold, currentTime) {
    let emissionReleaseTimeRefreshed = emissionReleaseTime
    if (currentTime > emissionReleaseTime) {
      const diff = Math.floor((currentTime - emissionReleaseTime) / emissionReleaseThreshold)
      if (diff > 0) {
        emissionReleaseTimeRefreshed += emissionReleaseThreshold * diff
      }
    }
    return emissionReleaseTimeRefreshed
  }

  getBallotInfo(_id, _votingKey) {
    return this.instance.methods.getBallotInfo(_id).call()
  }

  getTime() {
    return this.instance.methods.getTime().call()
  }

  hasAlreadyVoted(_id, _votingKey) {
    return this.instance.methods.hasAlreadyVoted(_id, _votingKey).call()
  }

  isActive(_id) {
    return this.instance.methods.isActive(_id).call()
  }

  isValidVote(_id, _votingKey) {
    return this.instance.methods.isValidVote(_id, _votingKey).call()
  }

  nextBallotId() {
    return this.instance.methods.nextBallotId().call()
  }

  noActiveBallotExists() {
    return this.instance.methods.noActiveBallotExists().call()
  }
}
