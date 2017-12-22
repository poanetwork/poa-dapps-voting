import React from 'react';
import moment from 'moment';
import { observable, action } from "mobx";
import { inject, observer } from "mobx-react";

@inject("contractsStore")
@observer
export class BallotMinThresholdCard extends React.Component {
  @observable startTime;
  @observable endTime;
  @observable timeToFinish;
  @observable proposedValue;

  @action("Get start time of min threshold ballot")
  getStartTime = async (_id) => {
    const { contractsStore } = this.props;
    let startTime = await contractsStore.votingToChangeMinThreshold.votingToChangeMinThresholdInstance.methods.getStartTime(_id).call()
    console.log(startTime)
    this.startTime = moment.utc(startTime*1000).format('DD/MM/YYYY h:mm A');
  }

  @action("Get end time of min threshold ballot")
  getEndTime = async (_id) => {
    const { contractsStore } = this.props;
    let endTime = await contractsStore.votingToChangeMinThreshold.votingToChangeMinThresholdInstance.methods.getEndTime(_id).call()
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

  @action("Get proposed value of min threshold ballot")
  getProposedValue = async (_id) => {
    const { contractsStore } = this.props;
    let proposedValue = await contractsStore.votingToChangeMinThreshold.votingToChangeMinThresholdInstance.methods.getProposedValue(_id).call()
    console.log(proposedValue)
    this.proposedValue = proposedValue;
  }

  constructor(props) {
    super(props);
    this.getStartTime(this.props.id);
    this.getEndTime(this.props.id);
    this.getProposedValue(this.props.id);
  }

  render () {
    return (
      <div className="ballots-i">
        <div className="ballots-about">
          <div className="ballots-about-i ballots-about-i_name">
            <div className="ballots-about-td">
              <p className="ballots-about-i--title">Name</p>
            </div>
            <div className="ballots-about-td">
              <p className="ballots-i--name">Suleyman Duyar</p>
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
          Minimum 3 from 12 validators  required to pass the proposal
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
