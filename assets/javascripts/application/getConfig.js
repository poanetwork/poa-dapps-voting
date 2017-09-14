//gets config file with address of Oracles contract
function getConfig(cb) {
  $.getJSON("./assets/javascripts/config.json", function(config) {
    var contractAddress = config.Ethereum[config.environment].contractAddress;
    var abi = config.Ethereum[config.environment].abi;
    cb(contractAddress, abi);
  });
}