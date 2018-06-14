import Web3 from 'web3';
import { networkAddresses } from './addresses';
import helpers from "./helpers";

export default class VotingToChangeProxy {
  constructor() {
    this.web3_10 = '';
    this.gasPrice = '';
  }

  async init({web3, netId}) {
    const {VOTING_TO_CHANGE_PROXY_ADDRESS} = networkAddresses(netId);
    console.log('VotingToChangeProxy address', VOTING_TO_CHANGE_PROXY_ADDRESS)
    let web3_10 = new Web3(web3.currentProvider);
    this.web3_10 = web3_10;
    this.gasPrice = this.web3_10.utils.toWei('2', 'gwei');

    const branch = helpers.getBranch(netId);

    let votingToChangeProxyABI = await helpers.getABI(branch, 'VotingToChangeProxyAddress')

    this.votingToChangeProxyInstance = new web3_10.eth.Contract(votingToChangeProxyABI, VOTING_TO_CHANGE_PROXY_ADDRESS);
    this.gasPrice = web3_10.utils.toWei('1', 'gwei');
  }

  //setters
  createBallot({startTime, endTime, proposedValue, contractType, sender, memo}) {
    let method;
    if (this.votingToChangeProxyInstance.methods.createBallot) {
      method = this.votingToChangeProxyInstance.methods.createBallot;
    } else {
      method = this.votingToChangeProxyInstance.methods.createBallotToChangeProxyAddress;
    }
    return method(startTime, endTime, proposedValue, contractType, memo).send({from: sender, gasPrice: this.gasPrice})
  }

  vote(_id, choice, sender) {
    return this.votingToChangeProxyInstance.methods.vote(_id, choice).send({from: sender, gasPrice: this.gasPrice})
  }

  finalize(_id, sender) {
    return this.votingToChangeProxyInstance.methods.finalize(_id).send({from: sender, gasPrice: this.gasPrice})
  }

  //getters
  doesMethodExist(methodName) {
    if (this.votingToChangeProxyInstance.methods[methodName]) {
      return true;
    }
    return false;
  }

  getStartTime(_id) {
    return this.votingToChangeProxyInstance.methods.getStartTime(_id).call();
  }

  getEndTime(_id) {
    return this.votingToChangeProxyInstance.methods.getEndTime(_id).call();
  }

  votingState(_id) {
    if (this.doesMethodExist('votingState')) {
      return this.votingToChangeProxyInstance.methods.votingState(_id).call();
    }
    return null;
  }

  getCreator(_id) {
    if (this.doesMethodExist('getCreator')) {
      return this.votingToChangeProxyInstance.methods.getCreator(_id).call();
    }
    return null;
  }

  getTotalVoters(_id) {
    return this.votingToChangeProxyInstance.methods.getTotalVoters(_id).call();
  }

  getProgress(_id) {
    return this.votingToChangeProxyInstance.methods.getProgress(_id).call();
  }

  getIsFinalized(_id) {
    return this.votingToChangeProxyInstance.methods.getIsFinalized(_id).call();
  }

  hasAlreadyVoted(_id, votingKey) {
    return this.votingToChangeProxyInstance.methods.hasAlreadyVoted(_id, votingKey).call();
  }

  isValidVote(_id, votingKey) {
    return this.votingToChangeProxyInstance.methods.isValidVote(_id, votingKey).call();
  }

  isActive(_id) {
    return this.votingToChangeProxyInstance.methods.isActive(_id).call();
  }

  canBeFinalizedNow(_id) {
    if (this.doesMethodExist('canBeFinalizedNow')) {
      return this.votingToChangeProxyInstance.methods.canBeFinalizedNow(_id).call();
    }
    return null;
  }

  getProposedValue(_id) {
    return this.votingToChangeProxyInstance.methods.getProposedValue(_id).call();
  }

  getContractType(_id) {
    return this.votingToChangeProxyInstance.methods.getContractType(_id).call();
  }

  getMemo(_id) {
    return this.votingToChangeProxyInstance.methods.getMemo(_id).call();
  }

  getMiningByVotingKey(_votingKey) {
    return this.votingToChangeProxyInstance.methods.getMiningByVotingKey(_votingKey).call();
  }

  async getValidatorActiveBallots(_votingKey) {
    let miningKey;
    try {
      miningKey = await this.getMiningByVotingKey(_votingKey);
    } catch(e) {
      miningKey = "0x0000000000000000000000000000000000000000";
    }
    return await this.votingToChangeProxyInstance.methods.validatorActiveBallots(miningKey).call();
  }

  async getBallotLimit(_votingKey) {
    const currentLimit = await this.votingToChangeProxyInstance.methods.getBallotLimitPerValidator().call();
    return currentLimit - await this.getValidatorActiveBallots(_votingKey);
  }
}