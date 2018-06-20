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
    let method;
    if (this.votingToChangeKeysInstance.methods.createBallot) {
      method = this.votingToChangeKeysInstance.methods.createBallot;
    } else {
      method = this.votingToChangeKeysInstance.methods.createVotingForKeys;
    }
    return method(startTime, endTime, affectedKey, affectedKeyType, miningKey, ballotType, memo).send({from: sender, gasPrice: this.gasPrice});
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

  nextBallotId() {
    return this.votingToChangeKeysInstance.methods.nextBallotId().call();
  }

  votingState(_id) {
    if (this.doesMethodExist('votingState')) {
      return this.votingToChangeKeysInstance.methods.votingState(_id).call();
    }
    return null;
  }

  getBallotInfo(_id, _votingKey) {
    if (this.doesMethodExist('getBallotInfo')) {
      return this.votingToChangeKeysInstance.methods.getBallotInfo(_id).call();
    }
    return null;
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

  getMiningByVotingKey(_votingKey) {
    return this.votingToChangeKeysInstance.methods.getMiningByVotingKey(_votingKey).call();
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
