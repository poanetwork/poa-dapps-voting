import Web3 from 'web3';
import { networkAddresses } from './addresses';
import helpers from "./helpers";

export default class VotingToChangeKeys {
  constructor() {
    this.web3_10 = '';
    this.gasPrice = '';
  }

  async init({web3, netId}) {
    const {VOTING_TO_CHANGE_KEYS_ADDRESS} = networkAddresses(netId);
    console.log('VotingToChangeKeys address', VOTING_TO_CHANGE_KEYS_ADDRESS);
    let web3_10 = new Web3(web3.currentProvider);
    this.web3_10 = web3_10;
    this.gasPrice = this.web3_10.utils.toWei('2', 'gwei');

    const branch = helpers.getBranch(netId);

    let votingToChangeKeysABI = await helpers.getABI(branch, 'VotingToChangeKeys')

    this.votingToChangeKeysInstance = new web3_10.eth.Contract(votingToChangeKeysABI, VOTING_TO_CHANGE_KEYS_ADDRESS);
    this.gasPrice = web3_10.utils.toWei('1', 'gwei');
  }

  //setters
  createBallot({startTime, endTime, affectedKey, affectedKeyType, miningKey, ballotType, sender, memo}) {
    return this.votingToChangeKeysInstance.methods.createBallot(startTime, endTime, affectedKey, affectedKeyType, miningKey, ballotType, memo).send({from: sender, gasPrice: this.gasPrice});
  }

  createBallotToAddNewValidator({startTime, endTime, affectedKey, newVotingKey, newPayoutKey, sender, memo}) {
    return this.votingToChangeKeysInstance.methods.createBallotToAddNewValidator(startTime, endTime, affectedKey, newVotingKey, newPayoutKey, memo).send({from: sender, gasPrice: this.gasPrice});
  }

  vote(_id, choice, sender) {
    return this.votingToChangeKeysInstance.methods.vote(_id, choice).send({from: sender, gasPrice: this.gasPrice});
  }

  finalize(_id, sender) {
    return this.votingToChangeKeysInstance.methods.finalize(_id).send({from: sender, gasPrice: this.gasPrice});
  }

  //getters
  areBallotParamsValid({ballotType, affectedKey, affectedKeyType, miningKey}) {
    return this.votingToChangeKeysInstance.methods.areBallotParamsValid(ballotType, affectedKey, affectedKeyType, miningKey).call();
  }

  doesMethodExist(methodName) {
    return this.votingToChangeKeysInstance && this.votingToChangeKeysInstance.methods[methodName];
  }

  getStartTime(_id) {
    return this.votingToChangeKeysInstance.methods.getStartTime(_id).call();
  }

  getEndTime(_id) {
    return this.votingToChangeKeysInstance.methods.getEndTime(_id).call();
  }

  votingState(_id) {
    if (this.doesMethodExist('votingState')) {
      return this.votingToChangeKeysInstance.methods.votingState(_id).call();
    }
    return null;
  }

  getCreator(_id) {
    if (this.doesMethodExist('getCreator')) {
      return this.votingToChangeKeysInstance.methods.getCreator(_id).call();
    }
    return null;
  }

  getTotalVoters(_id) {
    return this.votingToChangeKeysInstance.methods.getTotalVoters(_id).call();
  }

  getProgress(_id) {
    return this.votingToChangeKeysInstance.methods.getProgress(_id).call();
  }

  getIsFinalized(_id) {
    return this.votingToChangeKeysInstance.methods.getIsFinalized(_id).call();
  }

  hasAlreadyVoted(_id, votingKey) {
    return this.votingToChangeKeysInstance.methods.hasAlreadyVoted(_id, votingKey).call();
  }

  isValidVote(_id, votingKey) {
    return this.votingToChangeKeysInstance.methods.isValidVote(_id, votingKey).call();
  }

  isActive(_id) {
    return this.votingToChangeKeysInstance.methods.isActive(_id).call();
  }

  canBeFinalizedNow(_id) {
    if (this.doesMethodExist('canBeFinalizedNow')) {
      return this.votingToChangeKeysInstance.methods.canBeFinalizedNow(_id).call();
    }
    return null;
  }

  getBallotType(_id) {
    return this.votingToChangeKeysInstance.methods.getBallotType(_id).call();
  }

  getAffectedKeyType(_id) {
    return this.votingToChangeKeysInstance.methods.getAffectedKeyType(_id).call();
  }

  getAffectedKey(_id) {
    return this.votingToChangeKeysInstance.methods.getAffectedKey(_id).call();
  }

  getNewVotingKey(_id) {
    if (this.doesMethodExist('getNewVotingKey')) {
      return this.votingToChangeKeysInstance.methods.getNewVotingKey(_id).call();
    }
    return "";
  }

  getNewPayoutKey(_id) {
    if (this.doesMethodExist('getNewPayoutKey')) {
      return this.votingToChangeKeysInstance.methods.getNewPayoutKey(_id).call();
    }
    return "";
  }

  getMiningKey(_id) {
    return this.votingToChangeKeysInstance.methods.getMiningKey(_id).call();
  }

  getMiningByVotingKey(_votingKey) {
    return this.votingToChangeKeysInstance.methods.getMiningByVotingKey(_votingKey).call();
  }

  getMemo(_id) {
    return this.votingToChangeKeysInstance.methods.getMemo(_id).call();
  }

  async getValidatorActiveBallots(_votingKey) {
    let miningKey;
    try {
      miningKey = await this.getMiningByVotingKey(_votingKey);
    } catch(e) {
      miningKey = "0x0000000000000000000000000000000000000000";
    }
    return await this.votingToChangeKeysInstance.methods.validatorActiveBallots(miningKey).call();
  }

  async getBallotLimit(_votingKey) {
    const currentLimit = await this.votingToChangeKeysInstance.methods.getBallotLimitPerValidator().call();
    return currentLimit - await this.getValidatorActiveBallots(_votingKey);
  }
}
