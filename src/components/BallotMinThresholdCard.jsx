import React from "react";
import { observable, action } from "mobx";
import { inject, observer } from "mobx-react";
import { BallotCard } from "./BallotCard";

@inject("commonStore", "contractsStore", "routing")
@observer
export class BallotMinThresholdCard extends React.Component {
  @observable proposedValue;

  @action("Get proposed value of min threshold ballot")
  getProposedValue = async () => {
    const { contractsStore, id } = this.props;
    let proposedValue;
    try {
      proposedValue = await contractsStore.votingToChangeMinThreshold.getProposedValue(id);
    } catch(e) {
      console.log(e.message);
    }
    this.proposedValue = proposedValue;
  }

  constructor(props) {
    super(props);
    if (this.props.votingState) {
      this.proposedValue = this.props.votingState.proposedValue;
    } else {
      this.getProposedValue(this.props.id);
    }
  }

  isSearchPattern = () => {
    let { commonStore } = this.props;
    if (commonStore.searchTerm) {
      const isProposedValuePattern = String(this.proposedValue).toLowerCase().includes(commonStore.searchTerm);
      return  (isProposedValuePattern);
    }
    return true;
  }

  render () {
    let { id, votingState } = this.props;
    return (
      <BallotCard votingType="votingToChangeMinThreshold" votingState={votingState} id={id} isSearchPattern={this.isSearchPattern()}>
        <div className="ballots-about-i ballots-about-i_proposed-min-threshold">
          <div className="ballots-about-td">
            <p className="ballots-about-i--title">Proposed min threshold</p>
          </div>
          <div className="ballots-about-td">
            <p>{this.proposedValue}</p>
          </div>
        </div>
      </BallotCard>
    );
  }
}
