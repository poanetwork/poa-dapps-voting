import { observable, computed, action } from 'mobx';

class CommonStore {
	@observable loading;
	@observable rootPath;
	@observable filtered;

	constructor() {
		this.loading = false;
		this.filtered = false;
		this.rootPath = '/poa-dapps-voting'
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