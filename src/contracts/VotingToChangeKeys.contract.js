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

  createVotingForKeys(startTime, endTime, affectedKey, affectedKeyType, miningKey, ballotType, sender) {
    return this.votingToChangeKeysInstance.methods.createVotingForKeys(startTime, endTime, affectedKey, affectedKeyType, miningKey, ballotType).send({from: sender})
  }

  vote(id, choice, sender) {
    return this.votingToChangeKeysInstance.methods.vote(id, choice).send({from: sender})
  }

  finalize({id, sender}) {
    return this.votingToChangeKeysInstance.methods.finalize(id, id).send({from: sender})
  }
}
