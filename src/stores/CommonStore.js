import { observable, computed, action } from 'mobx';

class CommonStore {
	@observable loading;

	constructor() {
		this.loading = false;
	}

	@action("show loading")
	showLoading() {
		this.loading = true;
	}

	@action("hide loading")
	hideLoading() {
		this.loading = false;
	}
}

const commonStore = new CommonStore();

export default commonStore;
export { CommonStore };