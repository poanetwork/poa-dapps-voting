import { observable, computed, action } from 'mobx';
import React from 'react';

import PoaConsensus from '../contracts/PoaConsensus.contract'
import BallotsStorage from '../contracts/BallotsStorage.contract'
import VotingToChangeKeys from '../contracts/VotingToChangeKeys.contract'
import VotingToChangeMinThreshold from '../contracts/VotingToChangeMinThreshold.contract'
import VotingToChangeProxy from '../contracts/VotingToChangeProxy.contract'
import ValidatorMetadata from '../contracts/ValidatorMetadata.contract'
import ballotStore from './BallotStore'
import ballotsStore from './BallotsStore'
import commonStore from './CommonStore'
import { BallotKeysCard } from "../components/BallotKeysCard";
import { BallotMinThresholdCard } from "../components/BallotMinThresholdCard";
import { BallotProxyCard } from "../components/BallotProxyCard";

import "babel-polyfill";

class ContractsStore {
	@observable activeKeysBallotsIDs;
	@observable poaConsensus;
	@observable ballotsStorage;
	@observable votingToChangeKeys;
	@observable votingToChangeMinThreshold;
	@observable votingToChangeProxy;
	@observable validatorMetadata;
	@observable votingKey;
	@observable miningKey;
	@observable web3Instance;
	@observable validatorsLength;
	@observable keysBallotThreshold;
	@observable minThresholdBallotThreshold;
	@observable proxyBallotThreshold;
	@observable validatorLimits;
	@observable validatorsMetadata;

	constructor() {
		this.votingKey = null;
		this.miningKey = null;
		this.activeKeysBallotsIDs = [];
		this.validatorsMetadata = [];
		this.validatorLimits = {keys: null, minThreshold: null, proxy: null};
	}

	@computed get isValidVotingKey() {
		if (this.miningKey != "0x0000000000000000000000000000000000000000") return true;
		return false
	}

	@action("get keys ballot threshold")
	getKeysBallotThreshold = async () => {
		this.keysBallotThreshold = await this.ballotsStorage.ballotsStorageInstance.methods.getBallotThreshold(1).call();
	}

	@action("Get min threshold ballot threshold")
	async getMinThresholdBallotThreshold() {
		this.minThresholdBallotThreshold = await this.ballotsStorage.ballotsStorageInstance.methods.getBallotThreshold(1).call();
	}

	@action("get proxy ballot threshold")
	getProxyBallotThreshold = async () => {
		this.proxyBallotThreshold = await this.ballotsStorage.ballotsStorageInstance.methods.getProxyThreshold().call();
	}

	@action("Set web3Instance")
	setWeb3Instance = (web3Config) => {
		this.web3Instance = web3Config.web3Instance;
		this.netId = web3Config.netId;
	}

	@action("Set PoA Consensus contract")
	setPoaConsensus = (web3Config) => {
		this.poaConsensus = new PoaConsensus({
					web3: web3Config.web3Instance,
					netId: web3Config.netId
      	});
	}

	@action("Set Ballots Storage contract")
	setBallotsStorage = (web3Config) => {
		this.ballotsStorage = new BallotsStorage({
			web3: web3Config.web3Instance,
			netId: web3Config.netId
		});
	}

	@action("Set VotingToChangeKeys contract")
	setVotingToChangeKeys = (web3Config) => {
		this.votingToChangeKeys = new VotingToChangeKeys({
					web3: web3Config.web3Instance,
					netId: web3Config.netId
      	});
	}

	@action("Set VotingToChangeMinThreshold contract")
	setVotingToChangeMinThreshold = (web3Config) => {
		this.votingToChangeMinThreshold = new VotingToChangeMinThreshold({
			web3: web3Config.web3Instance,
			netId: web3Config.netId
      	});
	}

	@action("Set VotingToChangeProxy contract")
	setVotingToChangeProxy = (web3Config) => {
		this.votingToChangeProxy = new VotingToChangeProxy({
			web3: web3Config.web3Instance,
			netId: web3Config.netId
      	});
	}

	@action("Set ValidatorMetadata contract")
	setValidatorMetadata = (web3Config) => {
		this.validatorMetadata = new ValidatorMetadata({
			web3: web3Config.web3Instance,
			netId: web3Config.netId
      	});
	}

	@action("Get validators length")
	getValidatorsLength = async () => {
		this.validatorsLength = await this.poaConsensus.poaInstance.methods.getCurrentValidatorsLength().call();
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
			this.miningKey = "0x0000000000000000000000000000000000000000";
		}
	}

	@action("Get all keys ballots")
	getAllKeysBallots = async () => {
		let allKeysBallots = await this.votingToChangeKeys.votingToChangeKeysInstance.getPastEvents('BallotCreated', {fromBlock: 0});
    	let allKeysBallotsIDs = allKeysBallots.map((event) => event.returnValues.id)
    	this.activeKeysBallotsIDs = allKeysBallotsIDs;
	    for (let i = 0; i < allKeysBallotsIDs.length; i++) {
	    	ballotsStore.ballotCards.push(<BallotKeysCard id={this.activeKeysBallotsIDs[i]} type={ballotStore.BallotType.keys} key={ballotsStore.ballotCards.length}/>);
	    }

	    if (allKeysBallotsIDs.length == 0) {
	    	commonStore.hideLoading();
	    }
	}

	@action("Get all min threshold ballots")
	getAllMinThresholdBallots = async () => {
		let allMinThresholdBallots = await this.votingToChangeMinThreshold.votingToChangeMinThresholdInstance.getPastEvents('BallotCreated', {fromBlock: 0});
    	let allMinThresholdBallotsIDs = allMinThresholdBallots.map((event) => event.returnValues.id)
    	this.activeMinThresholdBallotsIDs = allMinThresholdBallotsIDs;
	    for (let i = 0; i < allMinThresholdBallotsIDs.length; i++) {
	    	ballotsStore.ballotCards.push(<BallotMinThresholdCard id={this.activeMinThresholdBallotsIDs[i]} type={ballotStore.BallotType.keys} key={ballotsStore.ballotCards.length}/>);
	    }

	    if (allMinThresholdBallotsIDs.length == 0) {
	    	commonStore.hideLoading();
	    }
	}

	@action("Get all proxy ballots")
	getAllProxyBallots = async () => {
		let allProxyBallots = await this.votingToChangeProxy.votingToChangeProxyInstance.getPastEvents('BallotCreated', {fromBlock: 0});
    	let allProxyBallotsIDs = allProxyBallots.map((event) => event.returnValues.id)
    	this.activeProxyBallotsIDs = allProxyBallotsIDs;
	    for (let i = 0; i < allProxyBallotsIDs.length; i++) {
	    	ballotsStore.ballotCards.push(<BallotProxyCard id={this.activeProxyBallotsIDs[i]} type={ballotStore.BallotType.keys} key={ballotsStore.ballotCards.length}/>);
	    }

	    if (allProxyBallotsIDs.length == 0) {
	    	commonStore.hideLoading();
	    }
	}

	@action
	async getValidatorActiveBallots() {
		if(this.web3Instance && this.netId){
			await this.setVotingToChangeKeys({web3Instance: this.web3Instance, netId: this.netId})
			await this.setVotingToChangeMinThreshold({web3Instance: this.web3Instance, netId: this.netId})
			await this.setVotingToChangeProxy({web3Instance: this.web3Instance, netId: this.netId})
			this.validatorLimits.keys = await this.votingToChangeKeys.getBallotLimit(this.web3Instance.eth.defaultAccount);
			this.validatorLimits.minThreshold = await this.votingToChangeMinThreshold.getBallotLimit(this.web3Instance.eth.defaultAccount);
			this.validatorLimits.proxy = await this.votingToChangeProxy.getBallotLimit(this.web3Instance.eth.defaultAccount);
		}
	}

	@action
	async getAllValidatorMetadata() {
		const keys = await this.poaConsensus.getValidators();
		keys.forEach(async (key) => {
			const metadata = await this.validatorMetadata.getValidatorData({miningKey: key})
			this.validatorsMetadata.push({label: `${key} ${metadata.lastName}`, value: key})
		})
	}
}

const contractsStore = new ContractsStore();

export default contractsStore;
export { ContractsStore };