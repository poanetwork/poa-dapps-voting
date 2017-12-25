import votingToChangeProxyABI from './votingToChangeProxy.abi.json'
import Web3 from 'web3';
import {VOTING_TO_CHANGE_PROXY} from './addresses'

console.log('VotingToChangeProxy ', VOTING_TO_CHANGE_PROXY)
export default class VotingToChangeProxy {
  constructor(){
    if(window.web3.currentProvider){
      let web3_10 = new Web3(window.web3.currentProvider);
      this.votingToChangeProxyInstance = new web3_10.eth.Contract(votingToChangeProxyABI, VOTING_TO_CHANGE_PROXY);
    }
  }

  createBallotToChangeProxyAddress(startTime, endTime, proposedValue, contractType, sender) {
    return this.votingToChangeProxyInstance.methods.createBallotToChangeProxyAddress(startTime, endTime, proposedValue, contractType).send({from: sender})
  }

  vote(id, choice, sender) {
    return this.votingToChangeProxyInstance.methods.vote(id, choice).send({from: sender})
  }

  finalize({id, sender}) {
    return this.votingToChangeProxyInstance.methods.finalize(id, id).send({from: sender})
  }
}
