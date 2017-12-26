let constants = {};
constants.INVALID_VOTING_KEY_MSG = "The key is not valid voting Key! Please make sure you have loaded correct voting key in metamask";
constants.VOTED_SUCCESS_MSG = "You successfully voted";
constants.BALLOT_CREATED_SUCCESS_MSG = "You successfully created a new ballot";
constants.FINALIZED_SUCCESS_MSG = "You successfully finalized";
constants.ALREADY_FINALIZED_MSG = "This ballot is already finalized";
constants.INVALID_VOTE_MSG = "You can't vote on this ballot";
constants.INVALID_FINALIZE_MSG = "You can't finalize this ballot";
constants.AFFECTED_KEY_IS_NOT_ADDRESS_MSG = `Ballot affectedKey isn't address`;
constants.MINING_KEY_IS_NOT_ADDRESS_MSG = `Ballot miningKey isn't address`;
constants.PROPOSED_ADDRESS_IS_NOT_ADDRESS_MSG = `Ballot proposedAddress isn't address`;
constants.END_TIME_SHOULD_BE_GREATER_THAN_NOW_MSG = "Ballot end time should be greater than now";
module.exports = {
  constants
}