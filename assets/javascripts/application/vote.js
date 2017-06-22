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