function SHA3Encrypt(web3, str, cb) {
  var strEncode = web3.sha3(str);
  cb(strEncode);
}

function estimateGas(web3, acc, contractAddr, data, cb) {
  console.log(web3);
  console.log(acc);
  console.log(contractAddr);
  console.log(data);
  web3.eth.estimateGas({
      from: acc, 
      data: data,
      to: contractAddr
  }, function(err, estimatedGas) {
    console.log(err);
    console.log(estimatedGas);
    cb(estimatedGas);
  });
}

function sendTx(web3, acc, contractAddr, data, estimatedGas, cb) {
  web3.eth.sendTransaction({
    from: acc,
    data: data,
    to: contractAddr,
    gas: estimatedGas
  }, function(err, txHash) {
    cb(txHash, err);
  });
}

function call(web3, acc, contractAddr, data, cb) {
  var props;
  if (acc) props = { from: acc, data: data, to: contractAddr };
  else props = { data: data, to: contractAddr };
  
  web3.eth.call(props, function(err, data) {
    cb(data);
  });
}

function getTxCallBack(txHash, cb) {
  web3.eth.getTransaction(txHash, function(err, txDetails) {
    if (err)
      console.log(err);

    if (!txDetails.blockNumber) {
      setTimeout(function() {
        getTxCallBack(txHash, cb);
      }, 2000)
    } else cb();
  });
};


function getContractStringDataFromAddressKey(web3, acc, func, inputVal, i, contractAddr, cb) {
  var funcHex = func.hexEncode();
  var funcParamsNumber = 1;
  var standardLength = 32;

  var parameterLocation = standardLength * funcParamsNumber;

  SHA3Encrypt(web3, funcHex, function(funcEncode) {
    var funcEncodePart = funcEncode.substring(0,10);
    
    var data = funcEncodePart
    + toUnifiedLengthLeft(inputVal);

    call(web3, acc, contractAddr, data, function(respHex) {
      console.log(respHex);
      cb(i, hex2a(respHex));
    });
  });
}

function getContractIntDataFromAddressKey(web3, acc, func, inputVal, i, contractAddr, cb) {
  var funcHex = func.hexEncode();
  var funcParamsNumber = 1;
  var standardLength = 32;

  var parameterLocation = standardLength * funcParamsNumber;

  SHA3Encrypt(web3, funcHex, function(funcEncode) {
    var funcEncodePart = funcEncode.substring(0,10);
    
    var data = funcEncodePart
    + toUnifiedLengthLeft(inputVal);

    call(web3, acc, contractAddr, data, function(respHex) {
      cb(i, parseInt(respHex, 16));
    });
  });
}

function getContractAddressDataFromAddressKey(web3, acc, func, inputVal, i, contractAddr, cb) {
  var funcHex = func.hexEncode();
  var funcParamsNumber = 1;
  var standardLength = 32;

  var parameterLocation = standardLength * funcParamsNumber;

  SHA3Encrypt(web3, funcHex, function(funcEncode) {
    var funcEncodePart = funcEncode.substring(0,10);
    
    var data = funcEncodePart
    + toUnifiedLengthLeft(inputVal);

    call(web3, acc, contractAddr, data, function(respHex) {
      cb(i, respHex);
    });
  });
}
