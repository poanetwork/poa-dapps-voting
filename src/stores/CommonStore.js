import { observable, action } from 'mobx';

class CommonStore {
	@observable loading;
	@observable rootPath;
	@observable isActiveFilter;
	@observable isToFinalizeFilter;
	@observable searchTerm;

	constructor() {
		this.loading = false;
		this.isActiveFilter = false;
		this.isToFinalizeFilter = false;
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

	@action("set search term")
	setSearchTerm = (_val) => {
		this.searchTerm = _val;
	}
}

const commonStore = new CommonStore();

export default commonStore;
export { CommonStore };