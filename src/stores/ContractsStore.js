import { observable, computed, action } from 'mobx';

import VotingToChangeKeys from '../contracts/VotingToChangeKeys.contract'
import VotingToChangeMinThreshold from '../contracts/VotingToChangeMinThreshold.contract'
import VotingToChangeProxy from '../contracts/VotingToChangeProxy.contract'

import "babel-polyfill";

class ContractsStore {
	@observable votingToChangeKeys;
	@observable votingToChangeMinThreshold;
	@observable votingToChangeProxy;
	@observable votingKey;
	@observable miningKey;
	@observable web3Instance;

	constructor() {
		this.votingToChangeKeys = null;
		this.votingToChangeMinThreshold = null;
		this.votingToChangeProxy = null;
		this.votingKey = null;
		this.miningKey = null;
	}

	@action("Set web3Instance")
	setWeb3Instance = (web3Config) => {
		this.web3Instance = web3Config.web3Instance;
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

	@action("Set voting key")
	setVotingKey = (web3Config) => {
		this.votingKey = web3Config.defaultAccount;
	}

	@action("Set mining key")
	setMiningKey = async (web3Config) => {
		try {
			this.miningKey = await this.votingToChangeKeys.votingToChangeKeysInstance.methods.getMiningByVotingKey(web3Config.defaultAccount).call();
		}
		catch(e) {
			console.log(e)
		}
	}
}

const contractsStore = new ContractsStore();

export default contractsStore;
export { ContractsStore };