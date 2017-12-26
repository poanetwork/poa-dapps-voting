import votingToChangeMinThresholdABI from './votingToChangeMinThreshold.abi.json'
import Web3 from 'web3';
import {VOTING_TO_CHANGE_MIN_THRESHOLD} from './addresses'

console.log('VotingToChangeMinThreshold ', VOTING_TO_CHANGE_MIN_THRESHOLD)
export default class VotingToChangeMinThreshold {
  constructor(){
    if(window.web3.currentProvider){
      let web3_10 = new Web3(window.web3.currentProvider);
      this.votingToChangeMinThresholdInstance = new web3_10.eth.Contract(votingToChangeMinThresholdABI, VOTING_TO_CHANGE_MIN_THRESHOLD);
    }
  }

  //setters
  createBallotToChangeThreshold(startTime, endTime, proposedValue, sender) {
    return this.votingToChangeMinThresholdInstance.methods.createBallotToChangeThreshold(startTime, endTime, proposedValue).send({from: sender})
  }

  vote(_id, choice, sender) {
    return this.votingToChangeMinThresholdInstance.methods.vote(_id, choice).send({from: sender})
  }

  finalize(_id, sender) {
    return this.votingToChangeMinThresholdInstance.methods.finalize(_id).send({from: sender})
  }

  //getters
  getStartTime(_id) {
    return this.votingToChangeMinThresholdInstance.methods.getStartTime(_id).call();
  }

  getEndTime(_id) {
    return this.votingToChangeMinThresholdInstance.methods.getEndTime(_id).call();
  }

  votingState(_id) {
    return this.votingToChangeMinThresholdInstance.methods.votingState(_id).call();
  }

  getTotalVoters(_id) {
    return this.votingToChangeMinThresholdInstance.methods.getTotalVoters(_id).call();
  }

  getProgress(_id) {
    return this.votingToChangeMinThresholdInstance.methods.getProgress(_id).call();
  }

  getIsFinalized(_id) {
    return this.votingToChangeMinThresholdInstance.methods.getIsFinalized(_id).call();
  }

  isValidVote(_id, votingKey) {
    return this.votingToChangeMinThresholdInstance.methods.isValidVote(_id, votingKey).call();
  }

  isActive(_id) {
    return this.votingToChangeMinThresholdInstance.methods.isActive(_id).call();
  }

  getProposedValue(_id) {
    return this.votingToChangeMinThresholdInstance.methods.getProposedValue(_id).call();
  }
}
