import React from 'react';
import { observable, action, computed } from "mobx";
import { inject, observer } from "mobx-react";
import { BallotCard } from './BallotCard';

@inject("commonStore", "contractsStore", "ballotStore", "routing")
@observer
export class BallotProxyCard extends React.Component {
  @observable proposedAddress;
  @observable contractType;

  @action("Get proposed address of proxy ballot")
  getProposedAddress = async () => {
    const { contractsStore, id } = this.props;
    let proposedAddress = await contractsStore.votingToChangeProxy.getProposedValue(id);
    this.proposedAddress = proposedAddress;
  }

  @action("Get contract type of proxy ballot")
  getContractType = async () => {
    const { contractsStore, id } = this.props;
    let contractType = await contractsStore.votingToChangeProxy.getContractType(id);
    this.contractType = contractType;
  }

  constructor(props) {
    super(props);
    this.getProposedAddress();
    this.getContractType();
  }

  hideCard = () => {
    let { commonStore } = this.props;
    let hideCard = commonStore.isActiveFilter && this.isFinalized;
    if (commonStore.searchTerm) {
      if (commonStore.searchTerm.length == 0) return hideCard;
      if (String(this.proposedAddress).toLowerCase().includes(commonStore.searchTerm)) return  (hideCard && false);
      if (String(this.contractType).toLowerCase().includes(commonStore.searchTerm)) return  (hideCard && false);
    } else {
      return hideCard;
    }
    
    return true;
  }

  render () {
    const { contractsStore, ballotStore, id } = this.props;
    let ballotClass = this.hideCard() ? "ballots-i display-none" : "ballots-i";
    return (
      <BallotCard votingType="votingToChangeProxy" id={id}>
        <div className="ballots-about-i ballots-about-i_contract-type">
            <div className="ballots-about-td">
              <p className="ballots-about-i--title">Contract type</p>
            </div>
            <div className="ballots-about-td">
              <p>{ballotStore.ProxyBallotType[this.contractType]}</p>
            </div>
          </div>
          <div className="ballots-about-i ballots-about-i_proposed-address">
            <div className="ballots-about-td">
              <p className="ballots-about-i--title">Proposed contract address</p>
            </div>
            <div className="ballots-about-td">
              <p>{this.proposedAddress}</p>
            </div>
          </div>
      </BallotCard>
    );
    /* <div className={ballotClass}>
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
          <div className="ballots-about-i ballots-about-i_contract-type">
            <div className="ballots-about-td">
              <p className="ballots-about-i--title">Contract type</p>
            </div>
            <div className="ballots-about-td">
              <p>{ballotStore.ProxyBallotType[this.contractType]}</p>
            </div>
          </div>
          <div className="ballots-about-i ballots-about-i_proposed-address">
            <div className="ballots-about-td">
              <p className="ballots-about-i--title">Proposed contract address</p>
            </div>
            <div className="ballots-about-td">
              <p>{this.proposedAddress}</p>
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
          Minimum {contractsStore.proxyBallotThreshold} from {contractsStore.validatorsLength} validators is required to pass the proposal
        </div>
        <hr />
        <div className="ballots-footer">
          <div className="ballots-footer-left">
            <button type="button" onClick={(e) => this.finalize(e)} className="ballots-footer-finalize">Finalize ballot</button>
            <p>{constants.CARD_FINALIZE_DESCRIPTION}</p>
          </div>
          <div type="button" className="ballots-i--vote ballots-i--vote_no">Proxy Ballot ID: {this.props.id}</div>
        </div>
      </div>*/
  }
}
