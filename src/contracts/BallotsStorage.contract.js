import ballotsStorageAbi from './ballotsStorage.abi.json'
import Web3 from 'web3';
import {BALLOTS_STORAGE_ADDRESS} from './addresses';

console.log('Ballots Storage Address ' , BALLOTS_STORAGE_ADDRESS)
export default class POAConsensus {
  constructor(){
    if(window.web3.currentProvider){
      let web3_10 = new Web3(window.web3.currentProvider);
      this.ballotsStorageInstance = new web3_10.eth.Contract(ballotsStorageAbi, BALLOTS_STORAGE_ADDRESS);
    }
  }
}