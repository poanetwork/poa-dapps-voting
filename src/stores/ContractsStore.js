import { observable, computed, action } from 'mobx';
import React from 'react';

import VotingToChangeKeys from '../contracts/VotingToChangeKeys.contract'
import VotingToChangeMinThreshold from '../contracts/VotingToChangeMinThreshold.contract'
import VotingToChangeProxy from '../contracts/VotingToChangeProxy.contract'
import ballotStore from './BallotStore'
import ballotsStore from './BallotsStore'
import getWeb3 from '../getWeb3';
import { BallotKeysCard } from "../components/BallotKeysCard";
import { BallotMinThresholdCard } from "../components/BallotMinThresholdCard";
import { BallotProxyCard } from "../components/BallotProxyCard";

import "babel-polyfill";

class ContractsStore {
	@observable activeKeysBallotsIDs;

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
		this.activeKeysBallotsIDs = [];

		getWeb3().then(async (web3Config) => {
	      contractsStore.setWeb3Instance(web3Config);
	    })
	}

	@computed get isValidVotingKey() {
		if (this.miningKey != "0x0000000000000000000000000000000000000000") return true;
		return false
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

	@action("Get all keys ballots")
	getAllKeysBallots = async () => {
		let allKeysBallots = await this.votingToChangeKeys.votingToChangeKeysInstance.getPastEvents('BallotCreated', {fromBlock: 0});
    	console.log("allKeysBallots:", allKeysBallots)
    	let allKeysBallotsIDs = allKeysBallots.map((event) => event.returnValues.id)
    	console.log("allKeysBallotsIDs:", allKeysBallotsIDs)
	    this.activeKeysBallotsIDs = allKeysBallotsIDs;
	    for (let i = 0; i < allKeysBallotsIDs.length; i++) {
	    	ballotsStore.ballotCards.push(<BallotKeysCard id={this.activeKeysBallotsIDs[i]} type={ballotStore.BallotType.keys}/>);
	    }
	}

	@action("Get all min threshold ballots")
	getAllMinThresholdBallots = async () => {
		let allMinThresholdBallots = await this.votingToChangeMinThreshold.votingToChangeMinThresholdInstance.getPastEvents('BallotCreated', {fromBlock: 0});
    	console.log("allMinThresholdBallots:", allMinThresholdBallots)
    	let allMinThresholdBallotsIDs = allMinThresholdBallots.map((event) => event.returnValues.id)
    	console.log("allMinThresholdBallotsIDs:", allMinThresholdBallotsIDs)
	    this.activeMinThresholdBallotsIDs = allMinThresholdBallotsIDs;
	    for (let i = 0; i < allMinThresholdBallotsIDs.length; i++) {
	    	ballotsStore.ballotCards.push(<BallotMinThresholdCard id={this.activeMinThresholdBallotsIDs[i]} type={ballotStore.BallotType.keys}/>);
	    }
	}

	@action("Get all proxy ballots")
	getAllProxyBallots = async () => {
		let allProxyBallots = await this.votingToChangeProxy.votingToChangeProxyInstance.getPastEvents('BallotCreated', {fromBlock: 0});
    	console.log("allProxyBallots:", allProxyBallots)
    	let allProxyBallotsIDs = allProxyBallots.map((event) => event.returnValues.id)
    	console.log("allProxyBallotsIDs:", allProxyBallotsIDs)
	    this.activeProxyBallotsIDs = allProxyBallotsIDs;
	    for (let i = 0; i < allProxyBallotsIDs.length; i++) {
	    	ballotsStore.ballotCards.push(<BallotProxyCard id={this.activeProxyBallotsIDs[i]} type={ballotStore.BallotType.keys}/>);
	    }
	}
}

const contractsStore = new ContractsStore();

export default contractsStore;
export { ContractsStore };