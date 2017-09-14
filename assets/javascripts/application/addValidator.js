function addValidator(web3, func, validatorViewObj, address, contractAddr, abi, cb) {


  attachToContract(web3, abi, contractAddr, function(err, oraclesContract) {
    console.log("attach to oracles contract");
    if (err) {
      console.log(err)
      return cb();
    }

    console.log(validatorViewObj);
    
    oraclesContract.addValidator.sendTransaction(
      validatorViewObj.miningKey, 
      validatorViewObj.zip, 
      validatorViewObj.licenseExpiredAt,
      validatorViewObj.licenseID,
      validatorViewObj.fullName,
      validatorViewObj.streetName,
      validatorViewObj.state,
      function(err, txHash) {
        if (err) {
          cb(txHash, err);
          return;
        }
        cb(txHash);
    });
  });

  /*var funcParamsNumber = 7;
  var standardLength = 32;

  SHA3Encrypt(web3, func, function(funcEncode) {
    var funcEncodePart = funcEncode.substring(0,10);
    if (validatorViewObj.miningKey.indexOf("0x") > -1) {
      validatorViewObj.miningKey = validatorViewObj.miningKey.substr(2);
    }
    validatorViewObj.miningKey = validatorViewObj.miningKey.toLowerCase();

    var licenseIDHex = "0x" + toUnifiedLengthRight(toHexString(toUTF8Array(validatorViewObj.licenseID)));
    var fullNameHex = "0x" + toUnifiedLengthRight(toHexString(toUTF8Array(validatorViewObj.fullName)));
    var streetNameHex = "0x" + toUnifiedLengthRight(toHexString(toUTF8Array(validatorViewObj.streetName)));
    var stateHex = "0x" + toUnifiedLengthRight(toHexString(toUTF8Array(validatorViewObj.state)));

    var parameterLocation1 = standardLength*funcParamsNumber;
    var parameterLocation2 = parameterLocation1 + standardLength*(countRows(licenseIDHex));
    var parameterLocation3 = parameterLocation2 + standardLength*(countRows(fullNameHex));
    var parameterLocation4 = parameterLocation3 + standardLength*(countRows(streetNameHex));

    var data = funcEncodePart
    + toUnifiedLengthLeft(validatorViewObj.miningKey)
    + toUnifiedLengthLeft(validatorViewObj.zip.toString(16))
    + toUnifiedLengthLeft(validatorViewObj.licenseExpiredAt.toString(16))
    + toUnifiedLengthLeft(parameterLocation1.toString(16))
    + toUnifiedLengthLeft(parameterLocation2.toString(16))
    + toUnifiedLengthLeft(parameterLocation3.toString(16))
    + toUnifiedLengthLeft(parameterLocation4.toString(16))
    + toUnifiedLengthLeft(bytesCount(validatorViewObj.licenseID).toString(16)) + licenseIDHex.substring(2)
    + toUnifiedLengthLeft(bytesCount(validatorViewObj.fullName).toString(16)) + fullNameHex.substring(2)
    + toUnifiedLengthLeft(bytesCount(validatorViewObj.streetName).toString(16)) + streetNameHex.substring(2)
    + toUnifiedLengthLeft(bytesCount(validatorViewObj.state).toString(16)) + stateHex.substring(2);

    getGasPrice(function(gasPrice) {
      console.log(gasPrice);
      estimateGas(web3, address, contractAddr, data, null, function(estimatedGas, err) {
        if (err) {
          cb(null, err);
          return;
        }
        estimatedGas += 100000;

        sendTx(web3, address, contractAddr, data, null, estimatedGas, gasPrice, function(txHash, err) {
          if (err) {
            cb(txHash, err);
            return;
          }
          cb(txHash);
        });
      });
    });
  });*/
}