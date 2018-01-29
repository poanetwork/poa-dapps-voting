import Web3 from 'web3';
import networkAddresses from './addresses';
import helpers from "./helpers";

export default class BallotsStorage {
  async init({web3, netId}){
      const {BALLOTS_STORAGE_ADDRESS} = networkAddresses(netId);
      console.log('Ballots Storage address', BALLOTS_STORAGE_ADDRESS);
      let web3_10 = new Web3(web3.currentProvider);
      const branch = helpers.getBranch(netId);

	  let that = this;

	  let ballotsStorageAbi = await helpers.getABI(branch, 'BallotStorage')

	  that.ballotsStorageInstance = new web3_10.eth.Contract(ballotsStorageAbi, BALLOTS_STORAGE_ADDRESS);
  }
}