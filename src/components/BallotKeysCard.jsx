import React from "react";
import { inject, observer } from "mobx-react";
import { BallotCard } from "./BallotCard";

@inject("commonStore", "routing")
@observer
export class BallotKeysCard extends React.Component {
  render () {
    let { id, votingState } = this.props;

    let affectedKeyClassName;
    let affectedKey = <p>{votingState.affectedKey}</p>;
    let newVotingKey;
    let newPayoutKey;
    let miningKeyDiv;
    if (votingState.isAddMining) {
      affectedKeyClassName = 'ballots-about-i_key_wide';
      if (votingState.newVotingKey || votingState.newPayoutKey) {
        affectedKey = <p>Mining: {votingState.affectedKey}</p>;
        if (votingState.newVotingKey) newVotingKey = <p>Voting: {votingState.newVotingKey}</p>;
        if (votingState.newPayoutKey) newPayoutKey = <p>Payout: {votingState.newPayoutKey}</p>;
      }
    } else {
      affectedKeyClassName = 'ballots-about-i_key';
      miningKeyDiv = <div className="ballots-about-i ballots-about-i_key">
        <div className="ballots-about-td">
          <p className="ballots-about-i--title">Validator key</p>
        </div>
        <div className="ballots-about-td">
          <p>{votingState.miningKey}</p>
        </div>
      </div>;
    }

    return (
      <BallotCard votingType="votingToChangeKeys" votingState={votingState} id={id}>
        <div className="ballots-about-i ballots-about-i_action">
          <div className="ballots-about-td">
            <p className="ballots-about-i--title">Action</p>
          </div>
          <div className="ballots-about-td">
            <p>{votingState.ballotTypeDisplayName}</p>
          </div>
        </div>
        <div className="ballots-about-i ballots-about-i_type">
          <div className="ballots-about-td">
            <p className="ballots-about-i--title">Key type</p>
          </div>
          <div className="ballots-about-td">
            <p>{votingState.affectedKeyTypeDisplayName}</p>
          </div>
        </div>
        <div className={`ballots-about-i ${affectedKeyClassName}`}>
          <div className="ballots-about-td">
            <p className="ballots-about-i--title">Affected key</p>
          </div>
          <div className="ballots-about-td">
            {affectedKey}
            {newVotingKey}
            {newPayoutKey}
          </div>
        </div>
        {miningKeyDiv}
      </BallotCard>
    );
  }
}
