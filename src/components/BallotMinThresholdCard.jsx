import React from 'react';
import moment from 'moment';
import { observable, action, computed } from "mobx";
import { inject, observer } from "mobx-react";
import { toAscii } from "../helpers";
import { constants } from "../constants";
import swal from 'sweetalert2';
import { BallotCard } from './BallotCard';

const ACCEPT = 1;
const REJECT = 2;
@inject("commonStore", "contractsStore", "routing")
@observer
export class BallotMinThresholdCard extends React.Component {
  @observable proposedValue;

  @action("Get proposed value of min threshold ballot")
  getProposedValue = async () => {
    const { contractsStore, id } = this.props;
    let proposedValue = await contractsStore.votingToChangeMinThreshold.getProposedValue(id);
    this.proposedValue = proposedValue;
  }

  constructor(props) {
    super(props);
    this.getProposedValue(this.props.id);
  }

  hideCard = () => {
    let { commonStore } = this.props;
    let hideCard = commonStore.isActiveFilter && this.isFinalized;
    if (commonStore.searchTerm) {
      if (commonStore.searchTerm.length == 0) return hideCard;
      if (String(this.proposedValue).toLowerCase().includes(commonStore.searchTerm)) return  (hideCard && false);
      if (String(this.creator).toLowerCase().includes(commonStore.searchTerm)) return  (hideCard && false);
    } else {
      return hideCard;
    }
    
    return true;
  }

  render () {
    let { contractsStore, id } = this.props;
    let ballotClass = this.hideCard() ? "ballots-i display-none" : "ballots-i";
    return (
      <BallotCard votingType="votingToChangeMinThreshold" id={id}>
        <div className="ballots-about-i ballots-about-i_proposed-min-threshold">
          <div className="ballots-about-td">
            <p className="ballots-about-i--title">Proposed min threshold</p>
          </div>
          <div className="ballots-about-td">
            <p>{this.proposedValue}</p>
          </div>
        </div>
      </BallotCard>
      /*<div className={ballotClass}>
        <div className="ballots-about">
          <div className="ballots-about-i ballots-about-i_name">
            <div className="ballots-about-td">
              <p className="ballots-about-i--title">Name</p>
            </div>
            <div className="ballots-about-td">
              <p className="ballots-i--name">{this.creator}</p>
              <p className="ballots-i--created">{this.startTime}</p>
            </div>
          </div>
          <div className="ballots-about-i ballots-about-i_proposed-min-threshold">
            <div className="ballots-about-td">
              <p className="ballots-about-i--title">Proposed min threshold</p>
            </div>
            <div className="ballots-about-td">
              <p>{this.proposedValue}</p>
            </div>
          </div>
          <div className="ballots-about-i ballots-about-i_time">
            <div className="ballots-about-td">
              <p className="ballots-about-i--title">Time</p>
            </div>
            <div className="ballots-about-td">
              <p className="ballots-i--time">{this.timeToFinish}</p>
              <p className="ballots-i--to-close">To close</p>
            </div>
          </div>
        </div>
        <div className="ballots-i-scale">
          <div className="ballots-i-scale-column">
            <button type="button" onClick={(e) => this.vote({choice: REJECT})} className="ballots-i--vote ballots-i--vote_no">No</button>
            <div className="vote-scale--container">
              <p className="vote-scale--value">No</p>
              <p className="vote-scale--votes">Votes: {this.votesAgainstNumber}</p>
              <p className="vote-scale--percentage">{this.votesAgainstPercents}%</p>
              <div className="vote-scale">
                <div className="vote-scale--fill vote-scale--fill_yes" style={{width: `${this.votesAgainstPercents}%`}}></div>
              </div>
            </div>
          </div>
          <div className="ballots-i-scale-column">
            <div className="vote-scale--container">
              <p className="vote-scale--value">Yes</p>
              <p className="vote-scale--votes">Votes: {this.votesForNumber}</p>
              <p className="vote-scale--percentage">{this.votesForPercents}%</p>
              <div className="vote-scale">
                <div className="vote-scale--fill vote-scale--fill_no" style={{width: `${this.votesForPercents}%`}}></div>
              </div>
            </div>
            <button type="button" onClick={(e) => this.vote({choice: ACCEPT})} className="ballots-i--vote ballots-i--vote_yes">Yes</button>
          </div>
        </div>
        <div className="info">
          Minimum {contractsStore.minThresholdBallotThreshold} from {contractsStore.validatorsLength} validators is required to pass the proposal
        </div>
        <hr />
        <div className="ballots-footer">
          <div className="ballots-footer-left">
            <button type="button" onClick={(e) => this.finalize(e)} className="ballots-footer-finalize">Finalize ballot</button>
            <p>{constants.CARD_FINALIZE_DESCRIPTION}</p>
          </div>
          <div type="button" className="ballots-i--vote ballots-i--vote_no">Consensus Ballot ID: {this.props.id}</div>
        </div>
      </div>*/
    );
  }
}
