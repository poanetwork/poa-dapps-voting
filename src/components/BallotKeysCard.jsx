import React from 'react';
import moment from 'moment';
import { observable, action, computed } from "mobx";
import { inject, observer } from "mobx-react";
import { toAscii } from "../helpers"

@inject("contractsStore", "ballotStore")
@observer
export class BallotKeysCard extends React.Component {
  @observable startTime;
  @observable endTime;
  @observable timeToFinish;
  @observable affectedKey;
  @observable affectedKeyType;
  @observable affectedKeyTypeDisplayName;
  @observable ballotType;
  @observable ballotTypeDisplayName;
  @observable creator;

  @action("Get ballotTypeDisplayName")
  getBallotTypeDisplayName(ballotType) {
    const { ballotStore } = this.props;
    switch(parseInt(ballotType)) {
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
    switch(parseInt(affectedKeyType)) {
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

  @action("Get start time of keys ballot")
  getStartTime = async (_id) => {
    const { contractsStore } = this.props;
    let startTime = await contractsStore.votingToChangeKeys.votingToChangeKeysInstance.methods.getStartTime(_id).call()
    console.log(startTime)
    this.startTime = moment.utc(startTime*1000).format('DD/MM/YYYY h:mm A');
  }

  @action("Get end time of keys ballot")
  getEndTime = async (_id) => {
    const { contractsStore } = this.props;
    let endTime = await contractsStore.votingToChangeKeys.votingToChangeKeysInstance.methods.getEndTime(_id).call()
    console.log(endTime)
    this.endTime = moment.utc(endTime*1000).format('DD/MM/YYYY h:mm A');
  }

  @action("Calculate time to finish")
  calcTimeToFinish = (_id) => {
    const now = moment();
    const finish = moment.utc(this.endTime*1000);
    const totalHours = moment.duration(finish.diff(now)).hours();
    const totalMinutes = moment.duration(finish.diff(now)).minutes();
    const minutes = totalMinutes - totalHours * 60;
    if (finish > now)
      this.timeToFinish = moment(totalHours, "h").format("HH") + ":" + moment(minutes, "m").format("mm");
    else
      this.timeToFinish = moment(0, "h").format("HH") + ":" + moment(0, "m").format("mm");
  }

  @action("Get ballot type of keys ballot")
  getBallotType = async (_id) => {
    const { contractsStore } = this.props;
    let ballotType = await contractsStore.votingToChangeKeys.votingToChangeKeysInstance.methods.getBallotType(_id).call()
    console.log(ballotType)
    this.ballotType = ballotType;
    this.getBallotTypeDisplayName(ballotType);
  }

  @action("Get affected key type of keys ballot")
  getAffectedKeyType = async (_id) => {
    const { contractsStore } = this.props;
    let affectedKeyType = await contractsStore.votingToChangeKeys.votingToChangeKeysInstance.methods.getAffectedKeyType(_id).call()
    console.log(affectedKeyType)
    this.affectedKeyType = affectedKeyType;
    this.getAffectedKeyTypeDisplayName(affectedKeyType);
  }


  @action("Get affected key of keys ballot")
  getAffectedKey = async (_id) => {
    const { contractsStore } = this.props;
    let affectedKey = await contractsStore.votingToChangeKeys.votingToChangeKeysInstance.methods.getAffectedKey(_id).call()
    console.log(affectedKey)
    this.affectedKey = affectedKey;
  }

  @action("Get creator")
  getCreator = async (_id) => {
    const { contractsStore } = this.props;
    let votingState = await contractsStore.votingToChangeKeys.votingToChangeKeysInstance.methods.votingState(_id).call()
    console.log("votingState:", votingState);
    this.getValidatorFullname(votingState.creator);
  }

  @action("Get validator full name")
  getValidatorFullname = async (_miningKey) => {
    const { contractsStore } = this.props;
    let validator = await contractsStore.validatorMetadata.metadataInstance.methods.validators(_miningKey).call();
    console.log(validator)
    console.log(validator.firstName)
    console.log(validator.firstName.length)
    let firstName = toAscii(validator.firstName);
    let lastName = toAscii(validator.lastName);
    let fullName = `${firstName} ${lastName}`
    this.creator = fullName ? fullName : _miningKey;
  }

  constructor(props) {
    super(props);
    this.getStartTime(this.props.id);
    this.getEndTime(this.props.id);
    this.getAffectedKey(this.props.id);
    this.getAffectedKeyType(this.props.id);
    this.getBallotType(this.props.id);
    this.getCreator(this.props.id);
    this.calcTimeToFinish(this.props.id);
  }

  render () {
    let { contractsStore } = this.props;
    return (
      <div className="ballots-i">
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
            <a href="#" className="ballots-i--vote ballots-i--vote_yes">Vote</a>
            <div className="vote-scale--container">
              <p className="vote-scale--value">Yes</p>
              <p className="vote-scale--votes">Votes: 40</p>
              <p className="vote-scale--percentage">40%</p>
              <div className="vote-scale">
                <div className="vote-scale--fill vote-scale--fill_yes" style={{width: '50%'}}></div>
              </div>
            </div>
          </div>
          <div className="ballots-i-scale-column">
            <div className="vote-scale--container">
              <p className="vote-scale--value">No</p>
              <p className="vote-scale--votes">Votes: 10</p>
              <p className="vote-scale--percentage">20%</p>
              <div className="vote-scale">
                <div className="vote-scale--fill vote-scale--fill_no" style={{width: '30%'}}></div>
              </div>
            </div>
            <a href="#" className="ballots-i--vote ballots-i--vote_no">Vote</a>
          </div>
        </div>
        <div className="info">
          Minimum 3 from {contractsStore.validatorsLength} validators is required to pass the proposal
        </div>
        <hr />
        <div className="ballots-footer">
          <a href="#" className="ballots-footer-finalize">Finalize ballot</a>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore</p>
        </div>
      </div>
    );
  }
}
