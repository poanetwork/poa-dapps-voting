import { observable, computed, action } from 'mobx';
import React from 'react';

import PoaConsensus from '../contracts/PoaConsensus.contract'
import BallotsStorage from '../contracts/BallotsStorage.contract'
import ProxyStorage from '../contracts/ProxyStorage.contract'
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
import { constants } from "../constants";

import "babel-polyfill";

class ContractsStore {
	@observable poaConsensus;
	@observable ballotsStorage;
	@observable proxyStorage;
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
		this.validatorsMetadata = [];
		this.validatorLimits = {keys: null, minThreshold: null, proxy: null};
	}

	@computed get isValidVotingKey() {
		if (this.miningKey != "0x0000000000000000000000000000000000000000") return true;
		return false
	}

	@action("Get keys ballot threshold")
	getKeysBallotThreshold = async () => {
		this.keysBallotThreshold = await this.ballotsStorage.ballotsStorageInstance.methods.getBallotThreshold(1).call();
	}

	@action("Get min threshold ballot threshold")
	async getMinThresholdBallotThreshold() {
		this.minThresholdBallotThreshold = await this.ballotsStorage.ballotsStorageInstance.methods.getBallotThreshold(1).call();
	}

	@action("Get proxy ballot threshold")
	getProxyBallotThreshold = async () => {
		this.proxyBallotThreshold = await this.ballotsStorage.ballotsStorageInstance.methods.getProxyThreshold().call();
	}

	@action("Set web3Instance")
	setWeb3Instance = (web3Config) => {
		this.web3Instance = web3Config.web3Instance;
		this.netId = web3Config.netId;
	}

	@action("Set PoA Consensus contract")
	setPoaConsensus = async (web3Config) => {
		this.poaConsensus = new PoaConsensus();
		await this.poaConsensus.init({
			web3: web3Config.web3Instance,
			netId: web3Config.netId
		});
	}

	@action("Set Ballots Storage contract")
	setBallotsStorage = async (web3Config) => {
		this.ballotsStorage = new BallotsStorage();
		await this.ballotsStorage.init({
			web3: web3Config.web3Instance,
			netId: web3Config.netId
		});
	}

	@action("Set ProxyStorage contract")
	setProxyStorage = async (web3Config) => {
		this.proxyStorage = new ProxyStorage();
		await this.proxyStorage.init({
			web3: web3Config.web3Instance,
			netId: web3Config.netId
		});
	}

	@action("Set VotingToChangeKeys contract")
	setVotingToChangeKeys = async (web3Config) => {
		this.votingToChangeKeys = new VotingToChangeKeys();
		await this.votingToChangeKeys.init({
			web3: web3Config.web3Instance,
			netId: web3Config.netId
		});
	}

	@action("Set VotingToChangeMinThreshold contract")
	setVotingToChangeMinThreshold = async (web3Config) => {
		this.votingToChangeMinThreshold = new VotingToChangeMinThreshold();
		await this.votingToChangeMinThreshold.init({
			web3: web3Config.web3Instance,
			netId: web3Config.netId
		});
	}

	@action("Set VotingToChangeProxy contract")
	setVotingToChangeProxy = async (web3Config) => {
		this.votingToChangeProxy = new VotingToChangeProxy();
		await this.votingToChangeProxy.init({
			web3: web3Config.web3Instance,
			netId: web3Config.netId
		});
	}

	@action("Set ValidatorMetadata contract")
	setValidatorMetadata = async (web3Config) => {
		this.validatorMetadata = new ValidatorMetadata();
		await this.validatorMetadata.init({
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
		} catch(e) {
			console.log(e)
			this.miningKey = "0x0000000000000000000000000000000000000000";
		}
	}

	@action("Get all keys ballots")
	getAllBallots = async () => {
		let allKeysBallots, allMinThresholdBallots, allProxyBallots;
		try {
			[allKeysBallots, allMinThresholdBallots, allProxyBallots] = await this.getAllBallotsIDsInternal();
		} catch (e) {
			console.log(e.message);
		}

		let allKeysBallotsIDs = this.getCards(allKeysBallots, "votingToChangeKeys");
		let allMinThresholdBallotsIDs = this.getCards(allMinThresholdBallots, "votingToChangeMinThreshold");
		let allProxyBallotsIDs = this.getCards(allProxyBallots, "votingToChangeProxy");

		await Promise.all([allKeysBallotsIDs, allMinThresholdBallotsIDs, allProxyBallotsIDs]);

		let allBallotsIDsLength = allKeysBallotsIDs.length + allMinThresholdBallotsIDs.length + allProxyBallotsIDs.length;

		if (allBallotsIDsLength == 0) {
			commonStore.hideLoading();
		}
	}

	getCards = async (allBallots, contractType) => {
		let allBallotsIDs = [];
		if (allBallots) {
			allBallotsIDs = allBallots.map((event) => event.returnValues.id)
			for (let i = allBallotsIDs.length - 1; i >= 0; i--) {

				let startTime = 0;
				try {
					startTime = await this[contractType].getStartTime(allBallotsIDs[i]);
				} catch(e) {
					console.log(e.message);
				}

				let card;
				switch(contractType) {
					case "votingToChangeKeys":
					card = <BallotKeysCard
					id={allBallotsIDs[i]}
					type={ballotStore.BallotType.keys}
					key={ballotsStore.ballotCards.length}
					startTime={startTime}/>
					break;
					case "votingToChangeMinThreshold":
					card = <BallotMinThresholdCard
					id={allBallotsIDs[i]}
					type={ballotStore.BallotType.minThreshold}
					key={ballotsStore.ballotCards.length}
					startTime={startTime}/>
					break;
					case "votingToChangeProxy":
					card = <BallotProxyCard
					id={allBallotsIDs[i]}
					type={ballotStore.BallotType.proxy}
					key={ballotsStore.ballotCards.length}
					startTime={startTime}/>
					break;
				}

				ballotsStore.ballotCards.push(card);
			}

			return allBallotsIDs;
		}
	}

	@action("Get all keys ballots internal")
	getAllBallotsIDsInternal = async () => {
		let getAllKeysBallotsIDs = this.votingToChangeKeys.votingToChangeKeysInstance.getPastEvents('BallotCreated', {fromBlock: 0});
		let getAllMinThresholdBallotsIDs = this.votingToChangeMinThreshold.votingToChangeMinThresholdInstance.getPastEvents('BallotCreated', {fromBlock: 0});
		let getAllProxyBallotsIDs = this.votingToChangeProxy.votingToChangeProxyInstance.getPastEvents('BallotCreated', {fromBlock: 0});

		return Promise.all([getAllKeysBallotsIDs, getAllMinThresholdBallotsIDs, getAllProxyBallotsIDs]);
	}

	@action
	async getBallotsLimits() {
		if(this.web3Instance && this.netId){
			let setVotingToChangeKeys = this.setVotingToChangeKeys({web3Instance: this.web3Instance, netId: this.netId})
			let setVotingToChangeMinThreshold = this.setVotingToChangeMinThreshold({web3Instance: this.web3Instance, netId: this.netId})
			let setVotingToChangeProxy = this.setVotingToChangeProxy({web3Instance: this.web3Instance, netId: this.netId})

			await Promise.all([setVotingToChangeKeys, setVotingToChangeMinThreshold, setVotingToChangeProxy]);

			let getKeysLimit = await this.votingToChangeKeys.getBallotLimit(this.web3Instance.eth.defaultAccount);
			let getMinThresholdLimit = await this.votingToChangeMinThreshold.getBallotLimit(this.web3Instance.eth.defaultAccount);
			let getProxyLimit = await this.votingToChangeProxy.getBallotLimit(this.web3Instance.eth.defaultAccount);

			await Promise.all([getKeysLimit, getMinThresholdLimit, getProxyLimit])
			.then(([keysLimit, minThresholdLimit, proxyLimit]) => {
				this.validatorLimits.keys = keysLimit;
				this.validatorLimits.minThreshold = minThresholdLimit;
				this.validatorLimits.proxy = proxyLimit;
			});
		}
	}

	@action
	async getAllValidatorMetadata() {
		this.validatorsMetadata.push(constants.NEW_MINING_KEY);
		const keys = await this.poaConsensus.getValidators();
		this.validatorsLength = keys.length;
		keys.forEach(async (key) => {
			const metadata = await this.validatorMetadata.getValidatorData({miningKey: key})
			this.validatorsMetadata.push({
				label: `${key} ${metadata.lastName}`,
				labelInvers: `${metadata.lastName} ${key}`,
				value: key
			})
		})
	}
}

const contractsStore = new ContractsStore();

export default contractsStore;
export { ContractsStore };