import React from "react";
import { observable, action } from "mobx";
import { inject, observer } from "mobx-react";
import { BallotCard } from "./BallotCard";

@inject("commonStore", "contractsStore", "ballotStore", "routing")
@observer
export class BallotKeysCard extends React.Component {
  @observable affectedKey;
  @observable newVotingKey;
  @observable newPayoutKey;
  @observable affectedKeyType;
  @observable ballotType;
  @observable ballotTypeDisplayName;
  @observable miningKey;

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

  @action("Get ballot type of keys ballot")
  getBallotType = async () => {
    const { contractsStore, id } = this.props;
    let ballotType;
    try {
      ballotType = await contractsStore.votingToChangeKeys.getBallotType(id);
    } catch(e) {
      console.log(e.message);
    }
    this.ballotType = ballotType;
    this.getBallotTypeDisplayName(ballotType);
  }

  @action("Get affected key type of keys ballot")
  getAffectedKeyType = async () => {
    const { contractsStore, id } = this.props;
    let affectedKeyType;
    try {
      affectedKeyType = await contractsStore.votingToChangeKeys.getAffectedKeyType(id);
    } catch(e) {
      console.log(e.message);
    }
    this.affectedKeyType = affectedKeyType;
  }

  @action("Get affected key of keys ballot")
  getAffectedKey = async () => {
    const { contractsStore, id } = this.props;
    let affectedKey;
    try {
      affectedKey = await contractsStore.votingToChangeKeys.getAffectedKey(id);
    } catch (e) {
      console.log(e.message);
    }
    this.affectedKey = affectedKey;
  }

  @action("Get new voting key of keys ballot")
  getNewVotingKey = async () => {
    const { contractsStore, id } = this.props;
    let newVotingKey;
    try {
      newVotingKey = await contractsStore.votingToChangeKeys.getNewVotingKey(id);
      if (newVotingKey === "0x0000000000000000000000000000000000000000") {
        newVotingKey = "";
      }
    } catch (e) {
      console.log(e.message);
    }
    this.newVotingKey = newVotingKey;
  }

  @action("Get new payout key of keys ballot")
  getNewPayoutKey = async () => {
    const { contractsStore, id } = this.props;
    let newPayoutKey;
    try {
      newPayoutKey = await contractsStore.votingToChangeKeys.getNewPayoutKey(id);
      if (newPayoutKey === "0x0000000000000000000000000000000000000000") {
        newPayoutKey = "";
      }
    } catch (e) {
      console.log(e.message);
    }
    this.newPayoutKey = newPayoutKey;
  }

  @action("Get mining key of keys ballot")
  getMiningKey = async () => {
    const { contractsStore, id } = this.props;
    let miningKey, metadata;
    try {
      miningKey = await contractsStore.votingToChangeKeys.getMiningKey(id);
    } catch(e) {
      console.log(e.message);
    }
    try {
      metadata = await contractsStore.getValidatorMetadata(miningKey);
    } catch(e) {
      console.log(e.message);
    }
    if (metadata) {
      this.miningKey = `${metadata.lastName} ${miningKey}`;
    } else {
      this.miningKey = `${miningKey}`;
    }
  }

  constructor(props) {
    super(props);
    this.getAffectedKey();
    this.getNewVotingKey();
    this.getNewPayoutKey();
    this.getAffectedKeyType();
    this.getBallotType();
    this.getMiningKey();
  }

  getAffectedKeyTypeDisplayName = () => {
    const { ballotStore } = this.props;
    let result;
    switch(parseInt(this.affectedKeyType, 10)) {
      case ballotStore.KeyType.mining:
        result = "mining";
        break;
      case ballotStore.KeyType.voting:
        result = "voting";
        break;
      case ballotStore.KeyType.payout:
        result = "payout";
        break;
      default:
        result =  "";
        break;
    }
    if (this.isAddMining()) {
      if (this.newVotingKey) result += ', voting';
      if (this.newPayoutKey) result += ', payout';
    }
    return result;
  }

  isAddMining = () => {
    const { ballotStore } = this.props;
    const ballotType = parseInt(this.ballotType, 10);
    const affectedKeyType = parseInt(this.affectedKeyType, 10);
    return ballotType === ballotStore.KeysBallotType.add && affectedKeyType === ballotStore.KeyType.mining;
  }

  isSearchPattern = () => {
    let { commonStore } = this.props;
    if (commonStore.searchTerm) {
      const affectedKeyTypeDisplayName = this.getAffectedKeyTypeDisplayName();
      const isMiningKeyPattern = String(this.miningKey).toLowerCase().includes(commonStore.searchTerm);
      const isAffectedKeyPattern = String(this.affectedKey).toLowerCase().includes(commonStore.searchTerm);
      const isNewVotingKeyPattern = String(this.newVotingKey).toLowerCase().includes(commonStore.searchTerm);
      const isNewPayoutKeyPattern = String(this.newPayoutKey).toLowerCase().includes(commonStore.searchTerm);
      const isAffectedKeyTypeDisplayNamePattern = String(affectedKeyTypeDisplayName).toLowerCase().includes(commonStore.searchTerm);
      const isBallotTypeDisplayNamePattern = String(this.ballotTypeDisplayName).toLowerCase().includes(commonStore.searchTerm);
      return (
        isMiningKeyPattern ||
        isAffectedKeyPattern ||
        isNewVotingKeyPattern ||
        isNewPayoutKeyPattern ||
        isAffectedKeyTypeDisplayNamePattern ||
        isBallotTypeDisplayNamePattern
      );
    }
    return true;
  }

  render () {
    let { id } = this.props;

    let affectedKeyClassName;
    let affectedKey = <p>{this.affectedKey}</p>;
    let newVotingKey;
    let newPayoutKey;
    let miningKeyDiv;
    if (this.isAddMining()) {
      affectedKeyClassName = 'ballots-about-i_key_wide';
      if (this.newVotingKey || this.newPayoutKey) {
        affectedKey = <p>Mining: {this.affectedKey}</p>;
        if (this.newVotingKey) newVotingKey = <p>Voting: {this.newVotingKey}</p>;
        if (this.newPayoutKey) newPayoutKey = <p>Payout: {this.newPayoutKey}</p>;
      }
    } else {
      affectedKeyClassName = 'ballots-about-i_key';
      miningKeyDiv = <div className="ballots-about-i ballots-about-i_key">
        <div className="ballots-about-td">
          <p className="ballots-about-i--title">Validator key</p>
        </div>
        <div className="ballots-about-td">
          <p>{this.miningKey}</p>
        </div>
      </div>;
    }

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
            <p>{this.getAffectedKeyTypeDisplayName()}</p>
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
