function addBallot(web3, func, ballotViewObj, address, contractAddr, cb) {
  console.log(ballotViewObj);
  var funcParamsNumber = 7;
  var standardLength = 32;

  SHA3Encrypt(web3, func, function(funcEncode) {
    var funcEncodePart = funcEncode.substring(0,10);
    var parameterLocation = standardLength * funcParamsNumber;

    if (ballotViewObj.miningKey.indexOf("0x") > -1)
      ballotViewObj.miningKey = ballotViewObj.miningKey.substr(2);
    ballotViewObj.miningKey = ballotViewObj.miningKey.toLowerCase();

    if (ballotViewObj.owner.indexOf("0x") > -1)
      ballotViewObj.owner = ballotViewObj.owner.substr(2);
    ballotViewObj.owner = ballotViewObj.owner.toLowerCase();

    if (ballotViewObj.affectedKey.indexOf("0x") > -1)
      ballotViewObj.affectedKey = ballotViewObj.affectedKey.substr(2);
    ballotViewObj.affectedKey = ballotViewObj.affectedKey.toLowerCase();

    ballotViewObj.addAction = JSON.parse(ballotViewObj.addAction);

    var memoHex = "0x" + toUnifiedLengthRight(toHexString(toUTF8Array(ballotViewObj.memo)));

    var data = funcEncodePart
    + toUnifiedLengthLeft(ballotViewObj.ballotID.toString(16))
    + toUnifiedLengthLeft(ballotViewObj.owner)
    + toUnifiedLengthLeft(ballotViewObj.miningKey)
    + toUnifiedLengthLeft(ballotViewObj.affectedKey)
    + toUnifiedLengthLeft(ballotViewObj.affectedKeyType.toString(16))
    + toUnifiedLengthLeft((+ballotViewObj.addAction).toString())
    + toUnifiedLengthLeft(parameterLocation.toString(16))
    + toUnifiedLengthLeft(bytesCount(ballotViewObj.memo).toString(16)) + memoHex.substring(2);

    estimateGas(web3, address, contractAddr, data, function(estimatedGas, err) {
      console.log(estimatedGas);
      if (err) return cb(null, err);

      estimatedGas += 100000;
      sendTx(web3, address, contractAddr, data, estimatedGas, function(txHash, err) {
        if (err) return cb(txHash, err);
        cb(txHash);
      });
    });
  });
}
function addValidator(web3, func, validatorViewObj, address, contractAddr, cb) {
  var funcParamsNumber = 7;
  var standardLength = 32;

  SHA3Encrypt(web3, func, function(funcEncode) {
    var funcEncodePart = funcEncode.substring(0,10);
    if (validatorViewObj.miningKey.indexOf("0x") > -1)
      validatorViewObj.miningKey = validatorViewObj.miningKey.substr(2);

    validatorViewObj.miningKey = validatorViewObj.miningKey.toLowerCase();

    var fullNameHex = "0x" + toUnifiedLengthRight(toHexString(toUTF8Array(validatorViewObj.fullName)));
    var streetNameHex = "0x" + toUnifiedLengthRight(toHexString(toUTF8Array(validatorViewObj.streetName)));
    var stateHex = "0x" + toUnifiedLengthRight(toHexString(toUTF8Array(validatorViewObj.state)));

    var parameterLocation1 = standardLength * funcParamsNumber;
    var parameterLocation2 = parameterLocation1 + standardLength*(countRows(fullNameHex));
    var parameterLocation3 = parameterLocation2 + standardLength*(countRows(streetNameHex));

    var data = funcEncodePart
    + toUnifiedLengthLeft(validatorViewObj.miningKey)
    + toUnifiedLengthLeft(validatorViewObj.zip.toString(16))
    + toUnifiedLengthLeft(validatorViewObj.licenseID.toString(16))
    + toUnifiedLengthLeft(validatorViewObj.licenseExpiredAt.toString(16))
    + toUnifiedLengthLeft(parameterLocation1.toString(16))
    + toUnifiedLengthLeft(parameterLocation2.toString(16))
    + toUnifiedLengthLeft(parameterLocation3.toString(16))
    + toUnifiedLengthLeft(bytesCount(validatorViewObj.fullName).toString(16)) + fullNameHex.substring(2)
    + toUnifiedLengthLeft(bytesCount(validatorViewObj.streetName).toString(16)) + streetNameHex.substring(2)
    + toUnifiedLengthLeft(bytesCount(validatorViewObj.state).toString(16)) + stateHex.substring(2);

    estimateGas(web3, address, contractAddr, data, function(estimatedGas, err) {
      if (err) return cb(null, err);

      estimatedGas += 100000;
      sendTx(web3, address, contractAddr, data, estimatedGas, function(txHash, err) {
        if (err) return cb(txHash, err);
        cb(txHash);
      });
    });
  });
}
function showAlert(err, msg) {
	if (!err) {
		swal({
		  title: "Error",
		  text: msg,
		  type: "error"
		});
	}
	else {
		if (err.type != "REQUEST_REJECTED") {
			swal({
			  title: "Error",
			  text: msg,
			  type: "error"
			});
		}
	}
}
function generateBallotID() {
	var min = 10000000;
	var max = 99999999;
  	return Math.floor(Math.random() * (max - min)) + min;
}
function SHA3Encrypt(web3, str, cb) {
  var strEncode = web3.utils.sha3(str);
  cb(strEncode);
}

function estimateGas(web3, acc, contractAddr, data, cb) {
  web3.eth.estimateGas({
      from: acc, 
      data: data,
      to: contractAddr
  }, function(err, estimatedGas) {
    if (err) console.log(err);
    console.log(estimatedGas);
    cb(estimatedGas, err);
  });
}

function sendTx(web3, acc, contractAddr, data, estimatedGas, cb) {
  web3.eth.sendTransaction({
    from: acc,
    data: data,
    to: contractAddr,
    gas: estimatedGas
  }, function(err, txHash) {
    if (err) console.log(err);
    cb(txHash, err);
  });
}

function call(web3, acc, contractAddr, data, cb) {
  var props;
  if (acc) props = { from: acc, data: data, to: contractAddr };
  else props = { data: data, to: contractAddr };
  
  web3.eth.call(props, function(err, data) {
    if (err) console.log(err);
    cb(data);
  });
}

function getTxCallBack(txHash, cb) {
  web3.eth.getTransaction(txHash, function(err, txDetails) {
    if (err) console.log(err);

    if (!txDetails.blockNumber) {
      setTimeout(function() {
        getTxCallBack(txHash, cb);
      }, 2000)
    } else cb();
  });
};


function getContractStringDataFromAddressKey(web3, acc, func, inputVal, i, contractAddr, cb) {
  var funcParamsNumber = 1;
  var standardLength = 32;

  var parameterLocation = standardLength * funcParamsNumber;

  SHA3Encrypt(web3, func, function(funcEncode) {
    var funcEncodePart = funcEncode.substring(0,10);
    
    var data = funcEncodePart
    + toUnifiedLengthLeft(inputVal);

    call(web3, acc, contractAddr, data, function(respHex) {
      cb(i, hex2a(respHex));
    });
  });
}

function getContractIntDataFromAddressKey(web3, acc, func, inputVal, i, contractAddr, cb) {
  var funcParamsNumber = 1;
  var standardLength = 32;

  var parameterLocation = standardLength * funcParamsNumber;

  SHA3Encrypt(web3, func, function(funcEncode) {
    var funcEncodePart = funcEncode.substring(0,10);
    
    var data = funcEncodePart
    + toUnifiedLengthLeft(inputVal);

    call(web3, acc, contractAddr, data, function(respHex) {
      cb(i, parseInt(respHex, 16));
    });
  });
}

function getContractAddressDataFromAddressKey(web3, acc, func, inputVal, i, contractAddr, cb) {
  var funcParamsNumber = 1;
  var standardLength = 32;

  var parameterLocation = standardLength * funcParamsNumber;

  SHA3Encrypt(web3, func, function(funcEncode) {
    var funcEncodePart = funcEncode.substring(0,10);
    
    var data = funcEncodePart
    + toUnifiedLengthLeft(inputVal);

    call(web3, acc, contractAddr, data, function(respHex) {
      cb(i, respHex);
    });
  });
}

//check current network page is connected to. Alerts, if not Oracles network
async function checkNetworkVersion(web3, cb) {
  var msgNotOracles = "You aren't connected to Oracles network. Please, switch on Oracles plugin and choose Oracles network. Check Oracles network <a href='https://github.com/oraclesorg/oracles-wiki' target='blank'>wiki</a> for more info.";
  let config = await getConfig()
  web3.eth.net.getId().then(function(connectedNetworkID) {
    console.log("connectedNetworkID: " + connectedNetworkID);
    connectedNetworkID = parseInt(connectedNetworkID);
    switch (connectedNetworkID) {
      case 1: {
        console.log('This is mainnet');
        swal("Warning", msgNotOracles, "warning"); 
        return false;
      } break;
      case 2: {
        console.log('This is the deprecated Morden test network.');
        swal("Warning", msgNotOracles, "warning");
        return false;
      } break;
      case 3: {
        console.log('This is the ropsten test network.');
        swal("Warning", msgNotOracles, "warning");
        return false;
      }  break;
       case config.networkID: {
         console.log('This is Oracles from Metamask');
         return true;
      }  break;
      default: {
        console.log('This is an unknown network.');
        swal("Warning", msgNotOracles, "warning");
        return false;
      } break;
    }
  })
}
function checkVotingKey(web3, func, key, contractAddr, cb) {
  var funcParamsNumber = 1;
  var standardLength = 32;

  SHA3Encrypt(web3, func, function(funcEncode) {
    var funcEncodePart = funcEncode.substring(0,10);

    var data = funcEncodePart
    + toUnifiedLengthLeft(key.substr(2));

    call(web3, key, contractAddr, data, function(respHex) {
      console.log(respHex);
      cb(parseInt(respHex, 16));
    });
  });
}
function hex2a(hexx) {
    var hex = hexx.toString();//force conversion
    var str = '';
    for (var i = 0; i < hex.length; i += 2) {
      var code = parseInt(hex.substr(i, 2), 16);
      if (code != 0 && !isNaN(code)) {
        str += String.fromCharCode(code);
      }
    }
    str = str.substr(2);
    return str;
}

function toUnifiedLengthLeft(strIn) {//for numbers
  var strOut = "";
  for (var i = 0; i < 64 - strIn.length; i++) {
    strOut += "0"
  }
  strOut += strIn;
  return strOut;
}

function countRows(strIn) {
  var rowsCount = 0;
  if (strIn.length%64 > 0)
    rowsCount = parseInt(strIn.length/64) + 1;
  else
    rowsCount = parseInt(strIn.length/64);
  return rowsCount;
}

function toUnifiedLengthRight(strIn) {//for strings
  var strOut = "";
  strOut += strIn;
  var rowsCount = countRows(strIn);
  for (var i = 0; i < rowsCount*64 - strIn.length; i++) {
    strOut += "0"
  }
  return strOut;
}

String.prototype.hexEncode = function(){
    var hex, i;

    var result = "";
    for (i=0; i<this.length; i++) {
        hex = this.charCodeAt(i).toString(16);
        result += hex.slice(-4);
    }

    return result
}

function toUTF8Array(str) {
    var utf8 = [];
    for (var i=0; i < str.length; i++) {
        var charcode = str.charCodeAt(i);
        if (charcode < 0x80) utf8.push(charcode);
        else if (charcode < 0x800) {
            utf8.push(0xc0 | (charcode >> 6), 
                      0x80 | (charcode & 0x3f));
        }
        else if (charcode < 0xd800 || charcode >= 0xe000) {
            utf8.push(0xe0 | (charcode >> 12), 
                      0x80 | ((charcode>>6) & 0x3f), 
                      0x80 | (charcode & 0x3f));
        }
        // surrogate pair
        else {
            i++;
            // UTF-16 encodes 0x10000-0x10FFFF by
            // subtracting 0x10000 and splitting the
            // 20 bits of 0x0-0xFFFFF into two halves
            charcode = 0x10000 + (((charcode & 0x3ff)<<10)
                      | (str.charCodeAt(i) & 0x3ff));
            utf8.push(0xf0 | (charcode >>18), 
                      0x80 | ((charcode>>12) & 0x3f), 
                      0x80 | ((charcode>>6) & 0x3f), 
                      0x80 | (charcode & 0x3f));
        }
    }
    return utf8;
}

function toHexString(byteArray) {
  return byteArray.map(function(byte) {
    return ('0' + (byte & 0xFF).toString(16)).slice(-2);
  }).join('')
}

function bytesCount(s) {
    return encodeURI(s).split(/%..|./).length - 1;
}
function createCookie(name, value, days) {
    var expires;

    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
    } else {
        expires = "";
    }
    document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) + expires + "; path=/";
}

function readCookie(name) {
    var nameEQ = encodeURIComponent(name) + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
    return null;
}
function formatDate(date, format, utc) {
    //var MMMM = ["\x00", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var MMMM = ["\x00", "января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];
    var MMM = ["\x01", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var dddd = ["\x02", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var ddd = ["\x03", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    function ii(i, len) {
        var s = i + "";
        len = len || 2;
        while (s.length < len) s = "0" + s;
        return s;
    }

    var y = utc ? date.getUTCFullYear() : date.getFullYear();
    format = format.replace(/(^|[^\\])yyyy+/g, "$1" + y);
    format = format.replace(/(^|[^\\])yy/g, "$1" + y.toString().substr(2, 2));
    format = format.replace(/(^|[^\\])y/g, "$1" + y);

    var M = (utc ? date.getUTCMonth() : date.getMonth()) + 1;
    format = format.replace(/(^|[^\\])MMMM+/g, "$1" + MMMM[0]);
    format = format.replace(/(^|[^\\])MMM/g, "$1" + MMM[0]);
    format = format.replace(/(^|[^\\])MM/g, "$1" + ii(M));
    format = format.replace(/(^|[^\\])M/g, "$1" + M);

    var d = utc ? date.getUTCDate() : date.getDate();
    format = format.replace(/(^|[^\\])dddd+/g, "$1" + dddd[0]);
    format = format.replace(/(^|[^\\])ddd/g, "$1" + ddd[0]);
    format = format.replace(/(^|[^\\])dd/g, "$1" + ii(d));
    format = format.replace(/(^|[^\\])d/g, "$1" + d);

    var H = utc ? date.getUTCHours() : date.getHours();
    format = format.replace(/(^|[^\\])HH+/g, "$1" + ii(H));
    format = format.replace(/(^|[^\\])H/g, "$1" + H);

    var h = H > 12 ? H - 12 : H == 0 ? 12 : H;
    format = format.replace(/(^|[^\\])hh+/g, "$1" + ii(h));
    format = format.replace(/(^|[^\\])h/g, "$1" + h);

    var m = utc ? date.getUTCMinutes() : date.getMinutes();
    format = format.replace(/(^|[^\\])mm+/g, "$1" + ii(m));
    format = format.replace(/(^|[^\\])m/g, "$1" + m);

    var s = utc ? date.getUTCSeconds() : date.getSeconds();
    format = format.replace(/(^|[^\\])ss+/g, "$1" + ii(s));
    format = format.replace(/(^|[^\\])s/g, "$1" + s);

    var f = utc ? date.getUTCMilliseconds() : date.getMilliseconds();
    format = format.replace(/(^|[^\\])fff+/g, "$1" + ii(f, 3));
    f = Math.round(f / 10);
    format = format.replace(/(^|[^\\])ff/g, "$1" + ii(f));
    f = Math.round(f / 10);
    format = format.replace(/(^|[^\\])f/g, "$1" + f);

    var T = H < 12 ? "AM" : "PM";
    format = format.replace(/(^|[^\\])TT+/g, "$1" + T);
    format = format.replace(/(^|[^\\])T/g, "$1" + T.charAt(0));

    var t = T.toLowerCase();
    format = format.replace(/(^|[^\\])tt+/g, "$1" + t);
    format = format.replace(/(^|[^\\])t/g, "$1" + t.charAt(0));

    var tz = -date.getTimezoneOffset();
    var K = utc || !tz ? "Z" : tz > 0 ? "+" : "-";
    if (!utc) {
        tz = Math.abs(tz);
        var tzHrs = Math.floor(tz / 60);
        var tzMin = tz % 60;
        K += ii(tzHrs) + ":" + ii(tzMin);
    }
    format = format.replace(/(^|[^\\])K/g, "$1" + K);

    var day = (utc ? date.getUTCDay() : date.getDay()) + 1;
    format = format.replace(new RegExp(dddd[0], "g"), dddd[day]);
    format = format.replace(new RegExp(ddd[0], "g"), ddd[day]);

    format = format.replace(new RegExp(MMMM[0], "g"), MMMM[M]);
    format = format.replace(new RegExp(MMM[0], "g"), MMM[M]);

    format = format.replace(/\\(.)/g, "$1");

    return format;
};

function getDateDiff(dateStart, dateEnd) {
    var periodInMinutes = Math.floor((dateEnd - dateStart)/60) + 1;
    if (periodInMinutes <= 0) {
        return "00:00";
    }


    var hours = Math.floor(periodInMinutes/60);
    var minutes = periodInMinutes%60;
    if (minutes == 60) {
        hours++;
        minutes = 0;
    }

    var hoursStr = hours.toString();
    if (hours < 9)
        hoursStr = "0" + hours.toString();
    var minutesStr = minutes.toString();
    if (minutes < 9)
        minutesStr = "0" + minutes.toString();

    return hoursStr + ":" + minutesStr;
}
function filterBallots(searchInput) {
	return ballotsArrayFiltered.map(function(ballot, i) {
		if (ballot) {
			var searchValidated = validateSearch(ballot, searchInput.toLowerCase());
	      	if (!searchValidated) return null;
	      	else return ballot;
		} else return null;
    })
}

function validateSearch(ballot, searchInput) {
	var ballotID = Object.keys(ballot)[0];

	var ballotObj = ballot[ballotID];
	if (ballotObj["memo"].toLowerCase().indexOf(searchInput) > -1) return true;
	else if (ballotObj["fullName"].toLowerCase().indexOf(searchInput) > -1) return true;
	else if (ballotObj["address"].toLowerCase().indexOf(searchInput) > -1) return true;
	else if (ballotObj["state"].toLowerCase().indexOf(searchInput) > -1) return true;
	else if (ballotObj["zip"].toLowerCase().indexOf(searchInput) > -1) return true;
	else if (ballotObj["zip"].toLowerCase().indexOf(searchInput) > -1) return true;
	else if (ballotObj["licenseID"].toLowerCase().indexOf(searchInput) > -1) return true;
	else if (ballotObj["licenseExpiredAt"].toLowerCase().indexOf(searchInput) > -1) return true;
	else if (ballotObj["miningKey"].toString().indexOf(searchInput) > -1) return true;

	return false;
}
//get current account chosen in MetaMask or opened at Parity
function getAccounts(cb) {
	web3.eth.getAccounts(function(err, accounts) {
		if (err) {
			$(".loading-container").hide();
			showAlert(err, err.message);
			return;
		}

		cb(accounts);
	});
}
function getBallots(web3, func, acc, contractAddress, cb) {
	SHA3Encrypt(web3, func, function(funcEncode) {
		var funcEncodePart = funcEncode.substring(0,10);

		var data = funcEncodePart;
		
		call(web3, null, contractAddress, data, function(ballotsResp) {
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
				getBallotMemo(web3, acc, ballotsArray[i], i, contractAddress, function(_i, resp) {
					iasync[_i]++;
					ballotsArrayOut = getBallotsPropertyCallback("memo", web3, contractAddress, resp, _i, iasync, ballotsArray, ballotDataCount, ballotsArrayOut, cb);
				});

				ballotCreatedAt(web3, acc, ballotsArray[i], i, contractAddress, function(_i, resp) {
					iasync[_i]++;
					ballotsArrayOut = getBallotsPropertyCallback("createdAt", web3, contractAddress, resp, _i, iasync, ballotsArray, ballotDataCount, ballotsArrayOut, cb);
				});

				getBallotVotingStart(web3, acc, ballotsArray[i], i, contractAddress, function(_i, resp) {
					iasync[_i]++;
					ballotsArrayOut = getBallotsPropertyCallback("votingStart", web3, contractAddress, resp, _i, iasync, ballotsArray, ballotDataCount, ballotsArrayOut, cb);
				});

				getBallotVotingEnd(web3, acc, ballotsArray[i], i, contractAddress, function(_i, resp) {
					iasync[_i]++;
					ballotsArrayOut = getBallotsPropertyCallback("votingEnd", web3, contractAddress, resp, _i, iasync, ballotsArray, ballotDataCount, ballotsArrayOut, cb);
				});

				getVotesFor(web3, acc, ballotsArray[i], i, contractAddress, function(_i, resp) {
					iasync[_i]++;
					ballotsArrayOut = getBallotsPropertyCallback("votesFor", web3, contractAddress, resp, _i, iasync, ballotsArray, ballotDataCount, ballotsArrayOut, cb);
				});

				getVotesAgainst(web3, acc, ballotsArray[i], i, contractAddress, function(_i, resp) {
					iasync[_i]++;
					ballotsArrayOut = getBallotsPropertyCallback("votesAgainst", web3, contractAddress, resp, _i, iasync, ballotsArray, ballotDataCount, ballotsArrayOut, cb);
				});

				getBallotAction(web3, acc, ballotsArray[i], i, contractAddress, function(_i, resp) {
					iasync[_i]++;
					ballotsArrayOut = getBallotsPropertyCallback("action", web3, contractAddress, resp, _i, iasync, ballotsArray, ballotDataCount, ballotsArrayOut, cb);
				});

				ballotIsVoted(web3, acc, ballotsArray[i], i, contractAddress, function(_i, resp) {
					iasync[_i]++;
					ballotsArrayOut = getBallotsPropertyCallback("voted", web3, contractAddress, resp, _i, iasync, ballotsArray, ballotDataCount, ballotsArrayOut, cb);
				});

				getBallotMiningKey(web3, acc, ballotsArray[i], i, contractAddress, function(_i, resp) {
					iasync[_i]++;
					ballotsArrayOut = getBallotsPropertyCallback("miningKey", web3, contractAddress, resp, _i, iasync, ballotsArray, ballotDataCount, ballotsArrayOut, cb);
				});

				getBallotAffectedKey(web3, acc, ballotsArray[i], i, contractAddress, function(_i, resp) {
					iasync[_i]++;
					ballotsArrayOut = getBallotsPropertyCallback("affectedKey", web3, contractAddress, resp, _i, iasync, ballotsArray, ballotDataCount, ballotsArrayOut, cb);
				});

				getBallotAffectedKeyType(web3, acc, ballotsArray[i], i, contractAddress, function(_i, resp) {
					iasync[_i]++;
					ballotsArrayOut = getBallotsPropertyCallback("affectedKeyType", web3, contractAddress, resp, _i, iasync, ballotsArray, ballotDataCount, ballotsArrayOut, cb);
				});

				getBallotOwner(web3, acc, ballotsArray[i], i, contractAddress, function(_i, resp) {
					iasync[_i]++;
					ballotsArrayOut = getBallotsPropertyCallback("owner", web3, contractAddress, resp, _i, iasync, ballotsArray, ballotDataCount, ballotsArrayOut, cb);
				});
			}
		});
	});
}

function getBallotsPropertyCallback(prop, web3, contractAddress, resp, _i, iasync, ballotsArray, ballotDataCount, ballotsArrayOut, cb) {
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
function getBallotView(acc, ballotID, ballotPropsObj, isVotingEnabled, web3, contractAddress, cb) {
  if (ballotPropsObj) {
    return ballotViewObject(ballotID, ballotPropsObj, isVotingEnabled);
  } else {
    getBallotData(web3, acc, ballotID, contractAddress, function(ballotPropsObj) {
      cb(ballotViewObject(ballotID, ballotPropsObj, isVotingEnabled));
    });
  }
}

function ballotViewObject(ballotID, ballotPropsObj, isVotingEnabled) {
  //votes
  var votesFor = ballotPropsObj["votesFor"];
  var votesAgainst = ballotPropsObj["votesAgainst"];
  var votesTotal = ballotPropsObj["votesFor"] + ballotPropsObj["votesAgainst"];
  var votesForPerc = 0;
  var votesAgainstPerc = 0;
  if (votesTotal > 0) {
    votesForPerc = Math.round((votesFor / votesTotal) * 100, 0);
    votesAgainstPerc = Math.round((votesAgainst / votesTotal) * 100, 0);
  }
  //action
  var actionDN;
  switch(ballotPropsObj["action"]) {
    case 0:
      actionDN = "Remove Notary";
      break;
    case 1:
      actionDN = "Add new Notary";
      break;
  }
  //miningKey
  var miningKey = ballotPropsObj["miningKey"];
  if (miningKey.length > 40) miningKey = "0x" + miningKey.substr(miningKey.length - 40);
  //affectedKey
  var affectedKey = ballotPropsObj["affectedKey"];
  if (affectedKey.length > 40) affectedKey = "0x" + affectedKey.substr(affectedKey.length - 40);
  //affectedKeyType
  var affectedKeyType;
  switch(ballotPropsObj["affectedKeyType"]) {
    case 0:
      affectedKeyType = "mining key";
      break;
    case 1:
      affectedKeyType = "voting key";
      break;
    case 2:
      affectedKeyType = "payout key";
      break;
  }
  //time to start/end
  var timeToVotingStart = getDateDiff(Math.floor(Date.now() / 1000), parseInt(ballotPropsObj["votingStart"]));
  var timeToVotingEnd = getDateDiff(Math.floor(Date.now() / 1000), parseInt(ballotPropsObj["votingEnd"]));
  var timeToVotingStartEnd = timeToVotingStart;
  var timeToVotingStartEndLabel = "To start";
  if (timeToVotingStart == "00:00") {
    timeToVotingStartEnd = timeToVotingEnd;
    timeToVotingStartEndLabel = "To end"
  }

  return `<div class="vote-i" ballot-id="` + ballotID + `">
          <div class="vote-header">
            <div class="vote-person left">
              <img src="./assets/images/person.png" alt="" class="vote-person-img">
              <p class="vote-person-name">` + (ballotPropsObj["owner"]?ballotPropsObj["owner"]:``) + `</p>
              <div class="vote-person-create">` + formatDate(new Date(parseInt(ballotPropsObj["createdAt"])*1000), "MM/dd/yyyy h:mm TT") + `</div>
            </div>
            <div class="vote-time right">
              <div class="vote-time-timer">` + timeToVotingStartEnd + `</div>
              <div class="vote-time-to">` + timeToVotingStartEndLabel + `</div>
            </div>
            ` + (isVotingEnabled?``:`<a href="#" class="vote-now right" ballot-id="` + ballotID + `" ` + (timeToVotingEnd == "00:00"?`hidden`:``) + `>Vote now</a>`) + `
          </div>
          <div class="vote-body">
            <div class="vote-body-i">
              <p class="vote-body-title">
                Proposal
                <span class="vote-tooltip-container">
                  <span class="vote-tooltip-icon"></span>
                  <span class="vote-tooltip">
                    <span class="vote-tooltip-text">
                      <span class="vote-tooltip-title">How does it work?</span>
                      <span class="vote-tooltip-description">
                        If you are a validator in Oracles network you can sign a vote with your voting key.
                        Please refer to voting FAQ on
                        <a href="https://forum.oracles.org/">https://forum.oracles.org/</a>
                      </span>
                    </span>
                    <span class="vote-tooltip-shadow"></span>
                  </span>
                </span>
              </p>
              <p class="vote-body-description">
                ` + ballotPropsObj["memo"] + `
              </p>
            </div>
            <div class="vote-body-i">
              <p class="vote-body-title">Mining key</p>
              <p class="vote-body-description">
                ` + miningKey + `
              </p>
              <p class="vote-body-title-secondary">Affected key (` + affectedKeyType + `)</p>
              <p class="vote-body-description">
                ` + affectedKey + `
              </p>
            </div>
            <div class="vote-body-i">
              <p class="vote-body-title">Title</p>
              <p class="vote-body-description">
                ` + actionDN + `
              </p>
            </div>
          </div>
          <div class="vote-rating">
            <div class="vote-rating-i left">
              <p class="vote-rating-value left">Yes</p>
              <div class="vote-rating-got right">
                <strong>` + votesForPerc + `%</strong>
                <p>Votes: ` + votesFor + `</p>
              </div>
              <div class="vote-rating-scale vote-rating-scale_yes">
                <div class="vote-rating-scale-active" style="width: ` + votesForPerc + `%"></div>
              </div>`
              + (isVotingEnabled? `<a href="#" class="vote-button vote-rating-yes left">Vote</a>`:``) +
            `</div>
            <div class="vote-rating-i right">
              <p class="vote-rating-value left">No</p>
              <div class="vote-button vote-rating-got right">
                <strong>` + votesAgainstPerc + `%</strong>
                <p>Votes: ` + votesAgainst + `</p>
              </div>
              <div class="vote-rating-scale vote-rating-scale_no">
                <div class="vote-rating-scale-active" style="width: ` + votesAgainstPerc + `%"></div>
              </div>`
              + (isVotingEnabled? `<a href="#" class="vote-button vote-rating-no right">Vote</a>`:``) +
            `</div>
          </div>
        </div>`;
}
//gets config file with address of Oracles contract
async function getConfig(cb) {
  	let config = await $.getJSON("./assets/javascripts/config.json")
	let contractAddress = config.Ethereum[config.environment].contractAddress
	let abi = config.Ethereum[config.environment].abi
	let networkID = config.networkID
	let configJSON = {
		contractAddress,
		networkID,
		abi
	}
	if (cb) cb(configJSON)
	return configJSON;
}
//gets web3 object from MetaMask or Parity
function getWeb3(callback) {
  if (typeof window.web3 === 'undefined') {
    // no web3, use fallback
    console.error("Please use a web3 browser");
    var msgNotEthereum = "You aren't connected to Oracles Network. Please, switch on Oracles plugin and refresh the page. Check Oracles network <a href='https://github.com/oraclesorg/oracles-wiki' target='blank'>wiki</a> for more info.";
    swal("Warning", msgNotEthereum, "warning");
    callback(myWeb3, false);
  } else {
    // window.web3 == web3 most of the time. Don't override the provided,
    // web3, just wrap it in your Web3.
    var myWeb3 = new Web3(window.web3.currentProvider); 

    // the default account doesn't seem to be persisted, copy it to our
    // new instance
    myWeb3.eth.defaultAccount = window.web3.eth.defaultAccount;

    let isOraclesNetwork = checkNetworkVersion(myWeb3)
    callback(myWeb3, isOraclesNetwork);
  }
}
//launches main application
function startDapp(web3, isOraclesNetwork) {
  	$(function() {
		if (!isOraclesNetwork) {
			$(".loading-container").hide();
			return;
		}
		var ballotsArrayFiltered = [];
		var votingKey;

		getAccounts(async function(accounts) {
			let config = await getConfig()
			getConfigCallBack(web3, accounts, config.contractAddress);	
		});

		//getting of config callback
		function getConfigCallBack(web3, accounts, contractAddress) {
			//checks if chosen account is valid voting key
			if (accounts.length == 1) {
				var possiblePayoutKey = accounts[0];
				checkVotingKey(web3,
				"checkVotingKeyValidity(address)", 
				possiblePayoutKey,
				contractAddress,
				function(_isActive) {
					_isActive = !!+_isActive;
					if (!_isActive) {
						$(".loading-container").hide();
						swal("Warning", "Current key isn't valid voting key. Please, choose your voting key in MetaMask client and reload the page. Check Oracles network <a href='https://github.com/oraclesorg/oracles-wiki' target='blank'>wiki</a> for more info.", "warning");
					} else $(".choose-key-button").trigger("click");
				});
			} else if (accounts.length == 0) {
				$(".loading-container").hide();
				swal("Warning", "You haven't chosen any account in MetaMask. Please, choose your voting key in MetaMask client and reload the page. Check Oracles network <a href='https://github.com/oraclesorg/oracles-wiki' target='blank'>wiki</a> for more info.", "warning");
			}

			$(".loading-container").hide();

			//choose key button onclick event
			$(".choose-key-button").on("click", function() {
				$(".loading-container").show();
				ballotsNavPan();
				$(".key-content").addClass("hidden");
				$(".content").removeClass("hidden");
				$(".container.vote").empty();
				$(".container.new-ballot").addClass("hidden");
				$(".container.vote").removeClass("hidden");
				$(".loading-container").hide();

				votingKey = $(".key-select").val();
				getBallots(web3, 
					"getBallots()", 
					votingKey,
					contractAddress,
					function(_ballotsArray) {
						ballotsArrayFiltered = _ballotsArray;
						showBallotsPage(_ballotsArray, web3, contractAddress);
					}
				);

				// ballots list nav filters onclick events
				$(".nav-i").on("click", function() {
					$(".search-input").val('');
					$(".loading-container").show();
					if ($(this).hasClass("nav-i_actual")) {
						$(".nav-i").removeClass("nav-i_active");
						$(this).addClass("nav-i_active");
						getBallotsList(web3, contractAddress);
					} else if ($(this).hasClass("nav-i_unanswered")) {
						$(".nav-i").removeClass("nav-i_active");
						$(this).addClass("nav-i_active");
						getBallotsList(web3, contractAddress, {filter: "unanswered"});
					} else if ($(this).hasClass("nav-i_expired")) {
						$(".nav-i").removeClass("nav-i_active");
						$(this).addClass("nav-i_active");
						getBallotsList(web3, contractAddress, {filter: "expired"});
					}
				});

				// search input onkeyup event
				$(".search-input").on("keyup", function() {
					var searchInput = $(this).val();
					var ballotsArrayFiltered = filterBallots(searchInput);
					$(".container.vote").empty();
					showBallotsPage(ballotsArrayFiltered, web3, contractAddress);
				});
			});

			if (readCookie('votingKey')) {
				votingKey = readCookie('votingKey');
				$(".choose-key-button").trigger("click");
			}
			for (var i = 0; i < accounts.length; i++) {
				if (i == 0) votingKey = accounts[i];
				if (readCookie('votingKey') == accounts[i] || (!readCookie('votingKey') && i == 0)) {
					$option = "<option name='key' value=" + accounts[i] + " selected>" + accounts[i] + "</option>";
					votingKey = accounts[i];
				} else 
					$option = "<option name='key' value=" + accounts[i] + ">" + accounts[i] + "</option>";
				$(".key-select").append($option);
			}

			//back button onclick event
			$(".back").on("click", function() {
				if ($(".new-ballot-add").attr("step") == 2) {
					$(".new-ballot-inputs").removeClass("hidden");
					$(".personal-data-inputs").addClass("hidden");
					$(".new-ballot-add").attr("step", 1);
					$(".new-ballot-add").html("Continue");
				} else {
					ballotsNavPan();
					getBallotsList(web3, contractAddress);
				}
			});

			//key select onchange event
			$(".key-select").change(function() {
				createCookie('votingKey', $(this).val(), 365);
				votingKey = $(this).val();
			});

			//settings button onclick event
			$(".header-settings").on("click", function() {
				$(".key-content").removeClass("hidden");
				$(".content").addClass("hidden");
			});

			//new ballot button onclick event
			$(".header-new-ballot").on("click", function() {
				$(".key-content").addClass("hidden");
				$(".content").removeClass("hidden");
				$(".container.new-ballot").removeClass("hidden");
				$(".container.vote").addClass("hidden");
				$(".container.new-ballot").empty();
				$(".container.new-ballot").load("./newBallot.html", function() {
					newBallotNavPan();

					$("#type_add").click(function() {
						$(".new-ballot-add").attr("step", 1);
						$(".new-ballot-add").html("Continue");
					});

					$("#type_remove").click(function() {
						$(".new-ballot-add").attr("step", 2);
						$(".new-ballot-add").html("Add Ballot");
					});

					$(".new-ballot-add").on("click", function() {
						if ($(this).attr("step") == 1) {
							$(".new-ballot-inputs").addClass("hidden");
							$(".personal-data-inputs").removeClass("hidden");
							$(".new-ballot-add").attr("step", 2);
							$(".new-ballot-add").html("Add Ballot");
							return;
						}

						$(".loading-container").show();
						var addAction = $("input[name=type]:checked").val();
						var ballotViewObj = {
							ballotID: generateBallotID(),
							memo: $("#memo").val(),
							miningKey: $("#mining-key").val(),
							affectedKey: $("#affected-key").val(),
							affectedKeyType: parseInt($("#affected-key-type").val()),
							owner: votingKey,
							addAction: addAction
						};

						var isAddress1 = web3.utils.isAddress($("#mining-key").val());
						var isAddress2 = web3.utils.isAddress($("#affected-key").val());
						if (!isAddress1 || !isAddress2) {
							$(".loading-container").hide();
							showAlert(null, "One or both keys are incorrect");
							return;
						}

						if (!addAction) {
							addBallotClick(web3, ballotViewObj, null, contractAddress);
						} else {
							var validatorViewObj = {
								miningKey: $("#mining-key").val(),
								fullName:  $("#full-name").val(),
								streetName: $("#address").val(),
								state: $("#state").val(),
								zip: $("#zip").val(),
								licenseID: $("#license-id").val(),
								licenseExpiredAt: new Date($("#license-expiration").val()).getTime() / 1000,
							};
							addBallotClick(web3, ballotViewObj, validatorViewObj, contractAddress);
						}
					});
				});
			});
		}

		//triggers after clicking "Add Ballot" button
		function addBallotClick(web3, ballotViewObj, validatorViewObj, contractAddress) {
			addBallot(web3, 
				"addBallot(uint256,address,address,address,uint256,bool,string)",
				ballotViewObj,
				votingKey,
				contractAddress,
				function(txHash, err) {
					addBallotCallBack(err, web3, txHash, ballotViewObj.addAction, validatorViewObj, contractAddress);
				}
			);
		}

		//Adding of ballot to contract callback
		function addBallotCallBack(err, web3, txHash, addAction, validatorViewObj, contractAddress) {
			if (err) {
				$(".loading-container").hide();
				showAlert(err, err.message);
				return;
			}

			if (!addAction) {
				getTxCallBack(txHash, function() {
					$(".loading-container").hide();
					$(".back").trigger("click");
				});
			} else {
				addValidator(web3, 
					"addValidator(address,uint256,uint256,uint256,string,string,string)",
					validatorViewObj,
					votingKey,
					contractAddress,
					function(txHash, err) {
						addValidatorCallBack(err, txHash, web3, contractAddress);
					}
				);
			}
		}

		//Adding of validator to contract callback
		function addValidatorCallBack(err, txHash, web3, contractAddress) {
			if (err) {
				$(".loading-container").hide();
				showAlert(err, err.message);
				return;
			}

			getTxCallBack(txHash, function() {
				$(".loading-container").hide();
				//$(".back").trigger("click");
				ballotsNavPan();
				getBallotsList(web3, contractAddress);
			});
		}

		//shows page with list of ballots
		function showBallotsPage(_ballotsArray, web3, contractAddress) {
			for(var i = 0; i < _ballotsArray.length; i++) {
				var ballot = _ballotsArray[i];
				if (ballot) {
					var ballotID = Object.keys(ballot)[0];
					var ballotPropsObj = ballot[ballotID];
					var ballotView = getBallotView(votingKey, ballotID, ballotPropsObj, false);
					$(".container.vote").append(ballotView);
				}
			}

			$(".loading-container").hide();

			//vote now button onclick event
			$(".vote-now").on("click", function() {
				getBallotView(votingKey, $(this).attr("ballot-id"), null, true, web3, contractAddress, function(ballotView) {
					showSingleBallotPage(ballotView, web3, contractAddress);
				});
			});
		}

		//shows page with single ballot
		function showSingleBallotPage(ballotView, web3, contractAddress) {
			$(".container.vote").empty();
			$(".container.vote").append(ballotView);
			newBallotNavPan();

			//vote button onclick event
			$(".vote-button").on("click", function(e) {
				voteButtonClick(web3, contractAddress, e, $(this));
			});
		}

		//triggers after .vote-button clicked
		function voteButtonClick(web3, contractAddress, e, $this) {
			$(".loading-container").show();
			var voteFor = $this.hasClass("vote-rating-yes")?true:false;

			var ballotID = $this.closest(".vote-i").attr("ballot-id");

			vote(web3, 
				"vote(uint256,bool)", 
				ballotID,
				voteFor,
				votingKey,
				contractAddress,
				function(txHash, err) {
					if (err) {
						$(".loading-container").hide();
						showAlert(err, "You are already voted or have no rights to vote");
						return;
					}

					getTxCallBack(txHash, function() {
						$(".loading-container").hide();
						$(".back").trigger("click");
					});
				}
			);
		}

		//change to new ballot navigation pan
		function newBallotNavPan() {
			$(".nav").addClass("hidden");
			$(".search-form").addClass("hidden");
			$(".back").removeClass("hidden");
		}

		//change to ballots navigation pan
		function ballotsNavPan() {
			$(".nav").removeClass("hidden");
			$(".search-form").removeClass("hidden");
			$(".back").addClass("hidden");
		}

		function getBallotsList(web3, contractAddress, filterObj) {
			$(".container.new-ballot").addClass("hidden");
			$(".container.vote").removeClass("hidden");
			$(".container.vote").empty();
			getBallots(web3, 
				"getBallots()",
				votingKey,
				contractAddress,
				function(_ballotsArray) {
					$(".loading-container").hide();
					if (!filterObj) {
						ballotsArrayFiltered = _ballotsArray;
						showBallotsPage(ballotsArrayFiltered, web3, contractAddress);
						return;
					}

					if (filterObj.filter == "expired") {
						var _ballotsArrayFiltered = [];
						for (var i = 0; i < _ballotsArray.length; i++) {
							var ballot = _ballotsArray[i];
							var ballotID = Object.keys(ballot)[0];
							if (new Date(ballot[ballotID].votingEnd*1000) < new (Date)) { //expired
								_ballotsArrayFiltered.push(ballot);
							}
						}
						ballotsArrayFiltered = _ballotsArrayFiltered;
						showBallotsPage(ballotsArrayFiltered, web3, contractAddress);
					} else if (filterObj.filter == "unanswered") {
						var _ballotsArrayFiltered = [];
						for (var i = 0; i < _ballotsArray.length; i++) {
							var ballot = _ballotsArray[i];
							var ballotID = Object.keys(ballot)[0];
							if (!ballot[ballotID].voted && (new Date(ballot[ballotID].votingEnd*1000) >= new (Date))) {
								_ballotsArrayFiltered.push(ballot);
							}
						}
						ballotsArrayFiltered = _ballotsArrayFiltered;
						showBallotsPage(ballotsArrayFiltered, web3, contractAddress);
					}
				}
			);
		}
	});
}


window.addEventListener('load', function() {
	getWeb3(startDapp);
});
function vote(web3, func, ballotID, action, address, contractAddr, cb) {
  var funcParamsNumber = 2;
  var standardLength = 32;

  SHA3Encrypt(web3, func, function(funcEncode) {
    var funcEncodePart = funcEncode.substring(0,10);

    var data = funcEncodePart
    + toUnifiedLengthLeft(ballotID.toString(16))
    + toUnifiedLengthLeft((+action).toString());

    estimateGas(web3, address, contractAddr, data, function(estimatedGas, err) {
      if (err) return cb(null, err);
      estimatedGas += 100000;
      
      sendTx(web3, address, contractAddr, data, estimatedGas, function(txHash, err) {
        if (err) return cb(txHash, err);
        cb(txHash);
      });
    });
  });
}