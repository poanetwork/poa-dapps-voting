import { observable, computed, action } from 'mobx';

class NewBallotStore {
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
	
	@observable validatorMetadata;
	@observable ballotMetadata;

	constructor() {
		this.ballotType = this.BallotType.keys;
		this.keyType = this.KeyType.mining;
		this.keysBallotType = this.KeysBallotType.add;
		this.ballotMetadata = {
			memo: "",
			affectedKey: ""
		};
		this.validatorMetadata = {
			fullName: "",
			address: "",
			state: "",
			zipCode: "",
			licenseID: "",
			licenseExpiration: ""
		};
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
		this.ballotMetadata[field] = e.target.value;
		console.log("ballot metadata", field, this.ballotMetadata[field])
	}

	@action("change validator metadata")
	changeValidatorMetadata = (e, field) => {
		console.log(e)
		this.validatorMetadata[field] = e?(e.target?e.target.value:e.label):"";
		console.log("validator metadata", field, this.validatorMetadata[field])
	}
}

const newBallotStore = new NewBallotStore();

export default newBallotStore;
export { NewBallotStore };