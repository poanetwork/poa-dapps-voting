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