import { observable, computed, action } from 'mobx';

class BallotsStore {
	@observable activeKeysBallotsLength;
	@observable activeMinThresholdBallotsLength;
	@observable activeProxyBallotsLength;
	@observable ballotCards;

	@observable activeMinThresholdBallotsIDs;
	@observable activeProxyBallotsIDs;

	constructor() {
		this.activeKeysBallotsLength = 0;
		this.activeMinThresholdBallotsLength = 0;
		this.activeProxyBallotsLength = 0;

		this.activeMinThresholdBallotsIDs = [];
		this.activeProxyBallotsIDs = [];
		this.ballotCards = [];
	}
}

const ballotsStore = new BallotsStore();

export default ballotsStore;
export { BallotsStore };