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