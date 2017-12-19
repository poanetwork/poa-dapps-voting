import { observable, computed, action } from 'mobx';

class BallotStore {
	BallotType = {
		keys: 1,
		minThreshold: 2,
		proxy: 3
	};
	KeysBallotType = {
		add: 1,
		remove: 2,
		swap: 3
	};
	KeyType = {
		mining: 1,
		voting: 2,
		payout: 3
	};
	@observable ballotType;
	@observable keysBallotType;
	@observable keyType;
	@observable memo;
	@observable affectedKey;
	@observable miningKey;
	@observable endTime;


	constructor() {
		this.ballotType = this.BallotType.keys;
		this.keyType = this.KeyType.mining;
		this.keysBallotType = this.KeysBallotType.add;
		this.memo = "";
		this.affectedKey = "";
		this.miningKey = "";
		this.endTime = 0;
	}

	@computed get isBallotForKey() {
		return this.ballotType === this.BallotType.keys
	}

	@computed get isBallotForMinThreshold() {
		return this.ballotType === this.BallotType.minThreshold
	}

	@computed get isBallotForProxy() {
		return this.ballotType === this.BallotType.proxy
	}

	@computed get isAddKeysBallotType() {
		return this.keysBallotType === this.KeysBallotType.add
	}

	@computed get isRemoveKeysBallotType() {
		return this.keysBallotType === this.KeysBallotType.remove
	}

	@computed get isSwapKeysBallotType() {
		return this.keysBallotType === this.KeysBallotType.swap
	}

	@computed get isMiningKeyType() {
		return this.keyType === this.KeyType.mining
	}

	@computed get isVotingKeyType() {
		return this.keyType === this.KeyType.voting
	}

	@computed get isPayoutKeyType() {
		return this.keyType === this.KeyType.payout
	}

	@action("change ballot type")
	changeBallotType = (e, _ballotType) => {
		console.log("change ballot type", _ballotType);
		this.ballotType = _ballotType;
	}

	@action("change keys ballot type")
	changeKeysBallotType = (e, _keysBallotType) => {
		console.log("change keys ballot type", _keysBallotType);
		this.keysBallotType = _keysBallotType;
	}

	@action("change affected key type")
	changeKeyType = (e, _keyType) => {
		console.log("change affected key type", _keyType);
		this.keyType = _keyType;
	}

	@action("change ballot metadata")
	changeBallotMetadata = (e, field) => {
		this[field] = e.target.value;
		console.log("ballot metadata", field, this[field])
	}
}

const ballotStore = new BallotStore();

export default ballotStore;
export { BallotStore };