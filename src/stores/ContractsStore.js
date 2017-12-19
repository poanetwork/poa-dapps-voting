import { observable, computed, action } from 'mobx';

import VotingToChangeKeys from '../contracts/VotingToChangeKeys.contract'
import VotingToChangeMinThreshold from '../contracts/VotingToChangeMinThreshold.contract'
import VotingToChangeProxy from '../contracts/VotingToChangeProxy.contract'

class ContractsStore {
	@observable votingToChangeKeys;
	@observable votingToChangeMinThreshold;
	@observable votingToChangeProxy;

	constructor() {
		this.votingToChangeKeys = null;
		this.votingToChangeMinThreshold = null;
		this.votingToChangeProxy = null;
	}

	@action("Set VotingToChangeKeys contract")
	setVotingToChangeKeys = (web3Config) => {
		this.votingToChangeKeys = new VotingToChangeKeys({
        	web3: web3Config.web3Instance
      	});
	}

	@action("Set VotingToChangeMinThreshold contract")
	setVotingToChangeMinThreshold = (web3Config) => {
		this.votingToChangeMinThreshold = new VotingToChangeMinThreshold({
        	web3: web3Config.web3Instance
      	});
	}

	@action("Set VotingToChangeProxy contract")
	setVotingToChangeProxy = (web3Config) => {
		this.votingToChangeProxy = new VotingToChangeProxy({
        	web3: web3Config.web3Instance
      	});
	}
}

const contractsStore = new ContractsStore();

export default contractsStore;
export { ContractsStore };