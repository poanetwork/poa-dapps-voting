function getBallotMemo(web3, acc, ballotID, i, contractAddr, cb) {
	var func = "getBallotMemo(uint256)";
	getContractStringDataFromAddressKey(web3, acc, func, ballotID, i, contractAddr, cb);
}

function ballotCreatedAt(web3, acc, ballotID, i, contractAddr, cb) {
	var func = "ballotCreatedAt(uint256)";
	getContractIntDataFromAddressKey(web3, acc, func, ballotID, i, contractAddr, cb);
}

function getBallotVotingStart(web3, acc, ballotID, i, contractAddr, cb) {
	var func = "getBallotVotingStart(uint256)";
	getContractIntDataFromAddressKey(web3, acc, func, ballotID, i, contractAddr, cb);
}

function getBallotVotingEnd(web3, acc, ballotID, i, contractAddr, cb) {
	var func = "getBallotVotingEnd(uint256)";
	getContractIntDataFromAddressKey(web3, acc, func, ballotID, i, contractAddr, cb);
}

function getVotesFor(web3, acc, ballotID, i, contractAddr, cb) {
	var func = "getVotesFor(uint256)";
	getContractIntDataFromAddressKey(web3, acc, func, ballotID, i, contractAddr, cb);
}

function getVotesAgainst(web3, acc, ballotID, i, contractAddr, cb) {
	var func = "getVotesAgainst(uint256)";
	getContractIntDataFromAddressKey(web3, acc, func, ballotID, i, contractAddr, cb);
}

function getBallotAction(web3, acc, ballotID, i, contractAddr, cb) {
	var func = "getBallotAction(uint256)";
	getContractIntDataFromAddressKey(web3, acc, func, ballotID, i, contractAddr, cb);
}

function ballotIsVoted(web3, acc, ballotID, i, contractAddr, cb) {
	var func = "ballotIsVoted(uint256)";
	getContractIntDataFromAddressKey(web3, acc, func, ballotID, i, contractAddr, cb);
}

function getBallotMiningKey(web3, acc, ballotID, i, contractAddr, cb) {
	var func = "getBallotMiningKey(uint256)";
	getContractAddressDataFromAddressKey(web3, acc, func, ballotID, i, contractAddr, cb);
}

function getBallotAffectedKey(web3, acc, ballotID, i, contractAddr, cb) {
	var func = "getBallotAffectedKey(uint256)";
	getContractAddressDataFromAddressKey(web3, acc, func, ballotID, i, contractAddr, cb);
}

function getBallotAffectedKeyType(web3, acc, ballotID, i, contractAddr, cb) {
	var func = "getBallotAffectedKeyType(uint256)";
	getContractIntDataFromAddressKey(web3, acc, func, ballotID, i, contractAddr, cb);
}

function getBallotOwner(web3, acc, ballotID, i, contractAddr, cb) {
	var func = "getBallotOwner(uint256)";
	getContractStringDataFromAddressKey(web3, acc, func, ballotID, i, contractAddr, cb);
}

function getBallotData(web3, acc, ballotID, contractAddress, cb) {
	var iasync = 0;
	var ballotDataCount = 12;
	var ballot = {};
	getBallotMemo(web3, acc, ballotID, null, contractAddress, function(_i, resp) {
		iasync++;
		ballot = getBallotPropertyCallback("memo", web3, contractAddress, ballotID, resp, iasync, ballot, ballotDataCount, cb);
	});

	ballotCreatedAt(web3, acc, ballotID, null, contractAddress, function(_i, resp) {
		iasync++;
		ballot = getBallotPropertyCallback("createdAt", web3, contractAddress, ballotID, resp, iasync, ballot, ballotDataCount, cb);
	});

	getBallotVotingStart(web3, acc, ballotID, null, contractAddress, function(_i, resp) {
		iasync++;
		ballot = getBallotPropertyCallback("votingStart", web3, contractAddress, ballotID, resp, iasync, ballot, ballotDataCount, cb);
	});

	getBallotVotingEnd(web3, acc, ballotID, null, contractAddress, function(_i, resp) {
		iasync++;
		ballot = getBallotPropertyCallback("votingEnd", web3, contractAddress, ballotID, resp, iasync, ballot, ballotDataCount, cb);
	});

	getVotesFor(web3, acc, ballotID, null, contractAddress, function(_i, resp) {
		iasync++;
		ballot = getBallotPropertyCallback("votesFor", web3, contractAddress, ballotID, resp, iasync, ballot, ballotDataCount, cb);
	});

	getVotesAgainst(web3, acc, ballotID, null, contractAddress, function(_i, resp) {
		iasync++;
		ballot = getBallotPropertyCallback("votesAgainst", web3, contractAddress, ballotID, resp, iasync, ballot, ballotDataCount, cb);
	});

	getBallotAction(web3, acc, ballotID, null, contractAddress, function(_i, resp) {
		iasync++;
		ballot = getBallotPropertyCallback("action", web3, contractAddress, ballotID, resp, iasync, ballot, ballotDataCount, cb);
	});

	ballotIsVoted(web3, acc, ballotID, null, contractAddress, function(_i, resp) {
		iasync++;
		ballot = getBallotPropertyCallback("voted", web3, contractAddress, ballotID, resp, iasync, ballot, ballotDataCount, cb);
	});

	getBallotMiningKey(web3, acc, ballotID, null, contractAddress, function(_i, resp) {
		iasync++;
		ballot = getBallotPropertyCallback("miningKey", web3, contractAddress, ballotID, resp, iasync, ballot, ballotDataCount, cb);
	});

	getBallotAffectedKey(web3, acc, ballotID, null, contractAddress, function(_i, resp) {
		iasync++;
		ballot = getBallotPropertyCallback("affectedKey", web3, contractAddress, ballotID, resp, iasync, ballot, ballotDataCount, cb);
	});

	getBallotAffectedKeyType(web3, acc, ballotID, null, contractAddress, function(_i, resp) {
		iasync++;
		ballot = getBallotPropertyCallback("affectedKeyType", web3, contractAddress, ballotID, resp, iasync, ballot, ballotDataCount, cb);
	});

	getBallotOwner(web3, acc, ballotID, null, contractAddress, function(_i, resp) {
		iasync++;
		ballot = getBallotPropertyCallback("owner", web3, contractAddress, ballotID, resp, iasync, ballot, ballotDataCount, cb);
	});
}

function getBallotPropertyCallback(prop, web3, contractAddress, ballotID, resp, iasync, ballot, ballotDataCount, cb) {
	if (Object.keys(ballot).length == 0) {
		ballot[ballotID] = {};
		ballot[ballotID][prop] = resp;
	} else ballot[ballotID][prop] = resp;

	if (iasync == ballotDataCount) {
		cb(ballot[ballotID]);
		return false;
	} else return ballot;
}