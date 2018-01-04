import votingToChangeKeysABI from './votingToChangeKeys.abi.json'
import Web3 from 'web3';
import {VOTING_TO_CHANGE_KEYS_ADDRESS} from './addresses'

console.log('VotingToChangeKeys ', VOTING_TO_CHANGE_KEYS_ADDRESS)
export default class VotingToChangeKeys {
  constructor(){
    if(window.web3.currentProvider){
      let web3_10 = new Web3(window.web3.currentProvider);
      this.votingToChangeKeysInstance = new web3_10.eth.Contract(votingToChangeKeysABI, VOTING_TO_CHANGE_KEYS_ADDRESS);
    }
  }

  //setters
  createVotingForKeys(startTime, endTime, affectedKey, affectedKeyType, miningKey, ballotType, sender) {
    return this.votingToChangeKeysInstance.methods.createVotingForKeys(startTime, endTime, affectedKey, affectedKeyType, miningKey, ballotType).send({from: sender});
  }

  vote(_id, choice, sender) {
    return this.votingToChangeKeysInstance.methods.vote(_id, choice).send({from: sender});
  }

  finalize(_id, sender) {
    return this.votingToChangeKeysInstance.methods.finalize(_id).send({from: sender});
  }

  //getters
  getStartTime(_id) {
    return this.votingToChangeKeysInstance.methods.getStartTime(_id).call();
  }

  getEndTime(_id) {
    return this.votingToChangeKeysInstance.methods.getEndTime(_id).call();
  }

  votingState(_id) {
    return this.votingToChangeKeysInstance.methods.votingState(_id).call();
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

  isValidVote(_id, votingKey) {
    return this.votingToChangeKeysInstance.methods.isValidVote(_id, votingKey).call();
  }

  isActive(_id) {
    return this.votingToChangeKeysInstance.methods.isActive(_id).call();
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

  getMiningByVotingKey(_votingKey) {
    return this.votingToChangeKeysInstance.methods.getMiningByVotingKey(_votingKey).call();
  }

  async getValidatorActiveBallots(_votingKey) {
    const miningKey = await this.getMiningByVotingKey(_votingKey);
    return await this.votingToChangeKeysInstance.methods.validatorActiveBallots(miningKey).call();
  }

  async getBallotLimit(_votingKey) {
    const currentLimit = await this.votingToChangeKeysInstance.methods.getBallotLimitPerValidator().call();
    return currentLimit - await this.getValidatorActiveBallots(_votingKey);
  }
}
