import ballotsStorageAbi from './ballotsStorage.abi.json'
import Web3 from 'web3';
import networkAddresses from './addresses';

export default class POAConsensus {
  constructor({web3, netId}){
      const {BALLOTS_STORAGE_ADDRESS} = networkAddresses(netId);
      console.log('Ballots Storage Address ' , BALLOTS_STORAGE_ADDRESS);
      let web3_10 = new Web3(web3.currentProvider);
      this.ballotsStorageInstance = new web3_10.eth.Contract(ballotsStorageAbi, BALLOTS_STORAGE_ADDRESS);
  }
}