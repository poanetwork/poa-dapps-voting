function getBallots(api, func, acc, contractAddress, cb) {
	var funcHex = func.hexEncode();
	
	SHA3Encrypt(api, funcHex, function(funcEncode) {
		var funcEncodePart = funcEncode.substring(0,10);

		var data = funcEncodePart;
		
		call(api, null, contractAddress, data, function(ballotsResp) {
			ballotsResp = ballotsResp.substring(2, ballotsResp.length);
			var ballotsArray = [];
			var item = "";
			for (var i = 0; i < ballotsResp.length; i++) {
				item+=ballotsResp[i];
				if ((i + 1)%64 == 0) {
					item = item.substr(item.length - 40, 40);
					ballotsArray.push(item);
					item = "";
				}
			}
			ballotsArray.shift();
			ballotsArray.shift(); //number of elements

			if (ballotsArray.length == 0) {
				cb(ballotsArray);
				return;
			}

			var ballotsArrayOut = [];
			var iasync = [];
			var ballotDataCount = 12;
			for (var i = 0; i < ballotsArray.length; i++) {
				iasync.push(0);
				getBallotMemo(api, acc, ballotsArray[i], i, contractAddress, function(_i, resp) {
					iasync[_i]++;
					ballotsArrayOut = getBallotsPropertyCallback("memo", api, contractAddress, resp, _i, iasync, ballotsArray, ballotDataCount, ballotsArrayOut, cb);
				});

				ballotCreatedAt(api, acc, ballotsArray[i], i, contractAddress, function(_i, resp) {
					iasync[_i]++;
					ballotsArrayOut = getBallotsPropertyCallback("createdAt", api, contractAddress, resp, _i, iasync, ballotsArray, ballotDataCount, ballotsArrayOut, cb);
				});

				getBallotVotingStart(api, acc, ballotsArray[i], i, contractAddress, function(_i, resp) {
					iasync[_i]++;
					ballotsArrayOut = getBallotsPropertyCallback("votingStart", api, contractAddress, resp, _i, iasync, ballotsArray, ballotDataCount, ballotsArrayOut, cb);
				});

				getBallotVotingEnd(api, acc, ballotsArray[i], i, contractAddress, function(_i, resp) {
					iasync[_i]++;
					ballotsArrayOut = getBallotsPropertyCallback("votingEnd", api, contractAddress, resp, _i, iasync, ballotsArray, ballotDataCount, ballotsArrayOut, cb);
				});

				getVotesFor(api, acc, ballotsArray[i], i, contractAddress, function(_i, resp) {
					iasync[_i]++;
					ballotsArrayOut = getBallotsPropertyCallback("votesFor", api, contractAddress, resp, _i, iasync, ballotsArray, ballotDataCount, ballotsArrayOut, cb);
				});

				getVotesAgainst(api, acc, ballotsArray[i], i, contractAddress, function(_i, resp) {
					iasync[_i]++;
					ballotsArrayOut = getBallotsPropertyCallback("votesAgainst", api, contractAddress, resp, _i, iasync, ballotsArray, ballotDataCount, ballotsArrayOut, cb);
				});

				getBallotAction(api, acc, ballotsArray[i], i, contractAddress, function(_i, resp) {
					iasync[_i]++;
					ballotsArrayOut = getBallotsPropertyCallback("action", api, contractAddress, resp, _i, iasync, ballotsArray, ballotDataCount, ballotsArrayOut, cb);
				});

				ballotIsVoted(api, acc, ballotsArray[i], i, contractAddress, function(_i, resp) {
					iasync[_i]++;
					ballotsArrayOut = getBallotsPropertyCallback("voted", api, contractAddress, resp, _i, iasync, ballotsArray, ballotDataCount, ballotsArrayOut, cb);
				});

				getBallotMiningKey(api, acc, ballotsArray[i], i, contractAddress, function(_i, resp) {
					iasync[_i]++;
					ballotsArrayOut = getBallotsPropertyCallback("miningKey", api, contractAddress, resp, _i, iasync, ballotsArray, ballotDataCount, ballotsArrayOut, cb);
				});

				getBallotAffectedKey(api, acc, ballotsArray[i], i, contractAddress, function(_i, resp) {
					iasync[_i]++;
					ballotsArrayOut = getBallotsPropertyCallback("affectedKey", api, contractAddress, resp, _i, iasync, ballotsArray, ballotDataCount, ballotsArrayOut, cb);
				});

				getBallotAffectedKeyType(api, acc, ballotsArray[i], i, contractAddress, function(_i, resp) {
					iasync[_i]++;
					ballotsArrayOut = getBallotsPropertyCallback("affectedKeyType", api, contractAddress, resp, _i, iasync, ballotsArray, ballotDataCount, ballotsArrayOut, cb);
				});

				getBallotOwner(api, acc, ballotsArray[i], i, contractAddress, function(_i, resp) {
					iasync[_i]++;
					ballotsArrayOut = getBallotsPropertyCallback("owner", api, contractAddress, resp, _i, iasync, ballotsArray, ballotDataCount, ballotsArrayOut, cb);
				});
			}
		});
	});
}

function getBallotsPropertyCallback(prop, api, contractAddress, resp, _i, iasync, ballotsArray, ballotDataCount, ballotsArrayOut, cb) {
	if (!ballotsArrayOut[_i]) {
		var ballot = {};
		ballot[ballotsArray[_i]] = {};
		ballot[ballotsArray[_i]][prop] = resp;
		ballotsArrayOut.push(ballot);
	} else ballotsArrayOut[_i][ballotsArray[_i]][prop] = resp;

	var finish = true;
	for (var j = 0;  j < iasync.length; j++) {
		if (iasync[j] < ballotDataCount) {
			finish = false;
			break;
		}
	}

	if (finish) {
		for (var j = 0; j < ballotsArray.length; j++) {
			var jasync = 0;
			var miningKey = ballotsArrayOut[j][ballotsArray[j]].miningKey;
			if (miningKey.length > 40) miningKey = miningKey.substr(miningKey.length - 40);
		}
		cb(ballotsArrayOut);
		return false;
	} else return ballotsArrayOut;
}