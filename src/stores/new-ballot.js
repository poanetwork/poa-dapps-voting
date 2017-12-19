import { observable } from 'mobx';

class NewBallotStore {
	@observable ballotType;
	@observable validatorMetadata = {
		fullName
	};
	@observable keysBallotType;
	@observable keyType;
	@observable memo;
	@observable affectedKey;

	const BallotType = {
		keys: 1,
		minThreshold: 2,
		proxy: 3
	}

	constructor() {
		this.ballotType = BallotType.minThreshold;
	}
}