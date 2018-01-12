import React from 'react';
import { observable, action } from "mobx";
import { inject, observer } from "mobx-react";
import { BallotCard } from './BallotCard';

@inject("commonStore", "contractsStore", "ballotStore", "routing")
@observer
export class BallotKeysCard extends React.Component {
  @observable affectedKey;
  @observable affectedKeyType;
  @observable affectedKeyTypeDisplayName;
  @observable ballotType;
  @observable ballotTypeDisplayName;

  @action("Get ballotTypeDisplayName")
  getBallotTypeDisplayName(ballotType) {
    const { ballotStore } = this.props;
    switch(parseInt(ballotType, 10)) {
      case ballotStore.KeysBallotType.add: 
        this.ballotTypeDisplayName = "add";
        break;
      case ballotStore.KeysBallotType.remove: 
        this.ballotTypeDisplayName = "remove";
        break;
      case ballotStore.KeysBallotType.swap: 
        this.ballotTypeDisplayName = "swap";
        break;
      default:
        this.ballotTypeDisplayName =  "";
        break;
    }
  }

  @action("Get affectedKeyTypeDisplayName")
  getAffectedKeyTypeDisplayName(affectedKeyType) {
    const { ballotStore } = this.props;
    switch(parseInt(affectedKeyType, 10)) {
      case ballotStore.KeyType.mining: 
        this.affectedKeyTypeDisplayName = "mining";
        break;
      case ballotStore.KeyType.voting: 
        this.affectedKeyTypeDisplayName = "voting";
        break;
      case ballotStore.KeyType.payout: 
        this.affectedKeyTypeDisplayName = "payout";
        break;
      default:
        this.affectedKeyTypeDisplayName =  "";
        break;
    }
  }

  @action("Get ballot type of keys ballot")
  getBallotType = async () => {
    const { contractsStore, id } = this.props;
    let ballotType = await contractsStore.votingToChangeKeys.getBallotType(id);
    this.ballotType = ballotType;
    this.getBallotTypeDisplayName(ballotType);
  }

  @action("Get affected key type of keys ballot")
  getAffectedKeyType = async () => {
    const { contractsStore, id } = this.props;
    let affectedKeyType = await contractsStore.votingToChangeKeys.getAffectedKeyType(id);
    this.affectedKeyType = affectedKeyType;
    this.getAffectedKeyTypeDisplayName(affectedKeyType);
  }


  @action("Get affected key of keys ballot")
  getAffectedKey = async () => {
    const { contractsStore, id } = this.props;
    let affectedKey = await contractsStore.votingToChangeKeys.getAffectedKey(id);
    this.affectedKey = affectedKey;
  }

  constructor(props) {
    super(props);
    this.getAffectedKey();
    this.getAffectedKeyType();
    this.getBallotType();
  }

  isSearchPattern = () => {
    let { commonStore } = this.props;
    if (commonStore.searchTerm) {
      const isAffectedKeyPattern = String(this.affectedKey).toLowerCase().includes(commonStore.searchTerm)
      const isAffectedKeyTypeDisplayNamePattern = String(this.affectedKeyTypeDisplayName).toLowerCase().includes(commonStore.searchTerm)
      const isBallotTypeDisplayNamePattern = String(this.ballotTypeDisplayName).toLowerCase().includes(commonStore.searchTerm)
      return  (isAffectedKeyPattern || isAffectedKeyTypeDisplayNamePattern || isBallotTypeDisplayNamePattern);
    }
    return true;
  }

  render () {
    let { id } = this.props;
    return (
      <BallotCard votingType="votingToChangeKeys" id={id} isSearchPattern={this.isSearchPattern()}>
        <div className="ballots-about-i ballots-about-i_action">
          <div className="ballots-about-td">
            <p className="ballots-about-i--title">Action</p>
          </div>
          <div className="ballots-about-td">
            <p>{this.ballotTypeDisplayName}</p>
          </div>
        </div>
        <div className="ballots-about-i ballots-about-i_type">
          <div className="ballots-about-td">
            <p className="ballots-about-i--title">Key type</p>
          </div>
          <div className="ballots-about-td">
            <p>{this.affectedKeyTypeDisplayName}</p>
          </div>
        </div>
        <div className="ballots-about-i ballots-about-i_mining-key">
          <div className="ballots-about-td">
            <p className="ballots-about-i--title">Affected key</p>
          </div>
          <div className="ballots-about-td">
            <p>{this.affectedKey}</p>
          </div>
        </div>
      </BallotCard>
    );
  }
}
