import React from "react";
import { inject, observer } from "mobx-react";
import { BallotCard } from "./BallotCard";

@inject("commonStore", "ballotStore", "routing")
@observer
export class BallotProxyCard extends React.Component {
  render () {
    const { id, votingState } = this.props;
    return (
      <BallotCard votingType="votingToChangeProxy" votingState={votingState} id={id}>
        <div className="ballots-about-i ballots-about-i_contract-type">
            <div className="ballots-about-td">
              <p className="ballots-about-i--title">Contract type</p>
            </div>
            <div className="ballots-about-td">
              <p>{votingState.contractTypeDisplayName}</p>
            </div>
          </div>
          <div className="ballots-about-i ballots-about-i_proposed-address">
            <div className="ballots-about-td">
              <p className="ballots-about-i--title">Proposed contract address</p>
            </div>
            <div className="ballots-about-td">
              <p>{votingState.proposedValue}</p>
            </div>
          </div>
      </BallotCard>
    );
  }
}
