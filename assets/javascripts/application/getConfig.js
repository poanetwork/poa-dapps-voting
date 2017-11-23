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