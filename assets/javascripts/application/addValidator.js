function addValidator(api, func, validatorViewObj, address, contractAddr, cb) {
  var funcHex = func.hexEncode();
  var funcParamsNumber = 7;
  var standardLength = 32;

  SHA3Encrypt(api, funcHex, function(funcEncode) {
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

    estimateGas(api, address, contractAddr, data, function(estimatedGas, err) {
      if (err) return cb(null, err);

      estimatedGas += 100000;
      sendTx(api, address, contractAddr, data, estimatedGas, function(txHash, err) {
        if (err) return cb(txHash, err);
        cb(txHash);
      });
    });
  });
}