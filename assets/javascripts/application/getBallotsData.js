function getBallotMemo(api, acc, ballotID, i, contractAddr, cb) {
	var func = "getBallotMemo(uint256)";
	getContractStringDataFromAddressKey(api, acc, func, ballotID, i, contractAddr, cb);
}

function ballotCreatedAt(api, acc, ballotID, i, contractAddr, cb) {
	var func = "ballotCreatedAt(uint256)";
	getContractIntDataFromAddressKey(api, acc, func, ballotID, i, contractAddr, cb);
}

function getBallotVotingStart(api, acc, ballotID, i, contractAddr, cb) {
	var func = "getBallotVotingStart(uint256)";
	getContractIntDataFromAddressKey(api, acc, func, ballotID, i, contractAddr, cb);
}

function getBallotVotingEnd(api, acc, ballotID, i, contractAddr, cb) {
	var func = "getBallotVotingEnd(uint256)";
	getContractIntDataFromAddressKey(api, acc, func, ballotID, i, contractAddr, cb);
}

function getVotesFor(api, acc, ballotID, i, contractAddr, cb) {
	var func = "getVotesFor(uint256)";
	getContractIntDataFromAddressKey(api, acc, func, ballotID, i, contractAddr, cb);
}

function getVotesAgainst(api, acc, ballotID, i, contractAddr, cb) {
	var func = "getVotesAgainst(uint256)";
	getContractIntDataFromAddressKey(api, acc, func, ballotID, i, contractAddr, cb);
}

function getBallotAction(api, acc, ballotID, i, contractAddr, cb) {
	var func = "getBallotAction(uint256)";
	getContractIntDataFromAddressKey(api, acc, func, ballotID, i, contractAddr, cb);
}

function ballotIsVoted(api, acc, ballotID, i, contractAddr, cb) {
	var func = "ballotIsVoted(uint256)";
	getContractIntDataFromAddressKey(api, acc, func, ballotID, i, contractAddr, cb);
}

function getBallotMiningKey(api, acc, ballotID, i, contractAddr, cb) {
	var func = "getBallotMiningKey(uint256)";
	getContractAddressDataFromAddressKey(api, acc, func, ballotID, i, contractAddr, cb);
}

function getBallotOwner(api, acc, ballotID, i, contractAddr, cb) {
	var func = "getBallotOwner(uint256)";
	getContractStringDataFromAddressKey(api, acc, func, ballotID, i, contractAddr, cb);
}

function getBallotData(api, acc, ballotID, contractAddress, cb) {
	var iasync = 0;
	var ballotDataCount = 10;
	var ballot = {};
	getBallotMemo(api, acc, ballotID, null, contractAddress, function(_i, resp) {
		iasync++;
		ballot = getBallotPropertyCallback("memo", api, contractAddress, ballotID, resp, iasync, ballot, ballotDataCount, cb);
	});

	ballotCreatedAt(api, acc, ballotID, null, contractAddress, function(_i, resp) {
		iasync++;
		ballot = getBallotPropertyCallback("createdAt", api, contractAddress, ballotID, resp, iasync, ballot, ballotDataCount, cb);
	});

	getBallotVotingStart(api, acc, ballotID, null, contractAddress, function(_i, resp) {
		iasync++;
		ballot = getBallotPropertyCallback("votingStart", api, contractAddress, ballotID, resp, iasync, ballot, ballotDataCount, cb);
	});

	getBallotVotingEnd(api, acc, ballotID, null, contractAddress, function(_i, resp) {
		iasync++;
		ballot = getBallotPropertyCallback("votingEnd", api, contractAddress, ballotID, resp, iasync, ballot, ballotDataCount, cb);
	});

	getVotesFor(api, acc, ballotID, null, contractAddress, function(_i, resp) {
		iasync++;
		ballot = getBallotPropertyCallback("votesFor", api, contractAddress, ballotID, resp, iasync, ballot, ballotDataCount, cb);
	});

	getVotesAgainst(api, acc, ballotID, null, contractAddress, function(_i, resp) {
		iasync++;
		ballot = getBallotPropertyCallback("votesAgainst", api, contractAddress, ballotID, resp, iasync, ballot, ballotDataCount, cb);
	});

	getBallotAction(api, acc, ballotID, null, contractAddress, function(_i, resp) {
		iasync++;
		ballot = getBallotPropertyCallback("action", api, contractAddress, ballotID, resp, iasync, ballot, ballotDataCount, cb);
	});

	ballotIsVoted(api, acc, ballotID, null, contractAddress, function(_i, resp) {
		iasync++;
		ballot = getBallotPropertyCallback("voted", api, contractAddress, ballotID, resp, iasync, ballot, ballotDataCount, cb);
	});

	getBallotMiningKey(api, acc, ballotID, null, contractAddress, function(_i, resp) {
		iasync++;
		ballot = getBallotPropertyCallback("miningKey", api, contractAddress, ballotID, resp, iasync, ballot, ballotDataCount, cb);
	});

	getBallotOwner(api, acc, ballotID, null, contractAddress, function(_i, resp) {
		iasync++;
		ballot = getBallotPropertyCallback("owner", api, contractAddress, ballotID, resp, iasync, ballot, ballotDataCount, cb);
	});
}

function getBallotPropertyCallback(prop, api, contractAddress, ballotID, resp, iasync, ballot, ballotDataCount, cb) {
	if (Object.keys(ballot).length == 0) {
		ballot[ballotID] = {};
		ballot[ballotID][prop] = resp;
	} else ballot[ballotID][prop] = resp;

	if (iasync == ballotDataCount) {
		cb(ballot[ballotID]);
		return false;
	} else return ballot;
}