let messages = {};
messages.INVALID_VOTING_KEY_MSG = "The key is not valid voting Key! Please make sure you have loaded correct voting key in metamask";
messages.VOTED_SUCCESS_MSG = "You successfully voted";
messages.BALLOT_CREATED_SUCCESS_MSG = "You successfully created a new ballot";
messages.FINALIZED_SUCCESS_MSG = "You successfully finalized";
messages.ALREADY_FINALIZED_MSG = "This ballot is already finalized";
messages.INVALID_VOTE_MSG = "You can't vote on this ballot";
messages.INVALID_FINALIZE_MSG = "You can't finalize this ballot";
messages.AFFECTED_KEY_IS_NOT_ADDRESS_MSG = `Ballot affectedKey isn't address`;
messages.MINING_KEY_IS_NOT_ADDRESS_MSG = `Ballot miningKey isn't address`;
messages.PROPOSED_ADDRESS_IS_NOT_ADDRESS_MSG = `Ballot proposedAddress isn't address`;
messages.END_TIME_SHOULD_BE_GREATER_THAN_NOW_MSG = "Ballot end time should be greater than now";
messages.NO_METAMASK_MSG = `You haven't chosen any account in MetaMask.
Please, choose your voting key in MetaMask and reload the page.
Check POA Network <a href='https://github.com/poanetwork/wiki' target='blank'>wiki</a> for more info.`;
messages.WRONG_NETWORK_MSG = `You aren't connected to POA Network. 
Please, switch on POA plugin and refresh the page. 
Check POA Network <a href='https://github.com/poanetwork/wiki' target='blank'>wiki</a> for more info.`;
messages.BALLOT_IS_NOT_ACTIVE_MSG = function(timeToStart) {
	return `The ballot is not active yet. Time to start: ${timeToStart}`
}
module.exports = {
  messages
}