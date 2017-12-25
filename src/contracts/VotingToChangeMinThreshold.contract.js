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

  createBallotToChangeThreshold(startTime, endTime, proposedValue, sender) {
    return this.votingToChangeMinThresholdInstance.methods.createBallotToChangeThreshold(startTime, endTime, proposedValue).send({from: sender})
  }

  vote(id, choice, sender) {
    return this.votingToChangeMinThresholdInstance.methods.vote(id, choice).send({from: sender})
  }

  finalize({id, sender}) {
    return this.votingToChangeMinThresholdInstance.methods.finalize(id, id).send({from: sender})
  }
}
