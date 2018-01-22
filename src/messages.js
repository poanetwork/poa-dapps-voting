let messages = {};
messages.invalidVotingKeyMsg = function(key) {
	return `The key ${key} is not valid voting Key! Please make sure you have loaded correct voting key in metamask`;
};
messages.VOTED_SUCCESS_MSG = "You successfully voted";
messages.BALLOT_CREATED_SUCCESS_MSG = "You successfully created a new ballot";
messages.FINALIZED_SUCCESS_MSG = "You successfully finalized";
messages.ALREADY_FINALIZED_MSG = "This ballot is already finalized";
messages.INVALID_VOTE_MSG = "You can't vote on this ballot";
messages.INVALID_FINALIZE_MSG = "You can't finalize this ballot";
messages.AFFECTED_KEY_IS_NOT_ADDRESS_MSG = "Ballot affectedKey isn't address";
messages.MINING_KEY_IS_NOT_ADDRESS_MSG = "Ballot miningKey isn't address";
messages.PROPOSED_ADDRESS_IS_NOT_ADDRESS_MSG = "Ballot proposedAddress isn't address";
messages.END_TIME_SHOULD_BE_GREATER_THAN_NOW_MSG = "Ballot end time should be greater than now";
messages.NO_METAMASK_MSG = `You haven't chosen any account in MetaMask.
Please, choose your voting key in MetaMask and reload the page.
Check POA Network <a href='https://github.com/poanetwork/wiki' target='blank'>wiki</a> for more info.`;
messages.WRONG_NETWORK_MSG = `You aren't connected to POA Network. 
Please, switch on POA plugin and refresh the page. 
Check POA Network <a href='https://github.com/poanetwork/wiki' target='blank'>wiki</a> for more info.`;
messages.ballotIsNotActiveMsg = function(timeToStart) {
	return `The ballot is not active yet. Time to start: ${timeToStart}`;
};
messages.SHOULD_BE_MORE_THAN_TWO_DAYS = (duration, neededHours, neededMinutes) => {
	return `Ballot end time should be at least 48 hours from now in UTC time. Current duration is ${duration} hours
		Please add ${neededHours} hours and ${neededMinutes} minutes in order to set correct end time
	`;
}
messages.FAILED_TX = `Your transaction was failed. Please make sure you set correct parameters for ballot creation.
Make sure you don't have Transaction Error. Exception thrown in contract code message in metamask before you sign it.`
messages.DESCRIPTION_IS_EMPTY = "Description cannot be empty";
module.exports = {
  messages
};