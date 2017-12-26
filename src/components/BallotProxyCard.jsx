import React from 'react';
import moment from 'moment';
import { observable, action, computed } from "mobx";
import { inject, observer } from "mobx-react";
import { toAscii } from "../helpers";
import { constants } from "../constants";
import swal from 'sweetalert2';

@inject("commonStore", "contractsStore", "ballotStore", "routing")
@observer
export class BallotProxyCard extends React.Component {
  @observable startTime;
  @observable endTime;
  @observable timeToFinish;
  @observable proposedAddress;
  @observable contractType;
  @observable creator;
  @observable progress;
  @observable totalVoters;

  @computed get votesForNumber() {
    let votes = (this.totalVoters + this.progress) / 2;
    return votes;
  }

  @computed get votesForPercents() {
    if (this.totalVoters <= 0)
      return 0;

    let votesPercents = Math.round(this.votesForNumber / this.totalVoters * 100);
    return votesPercents;
  }

  @computed get votesAgainstNumber() {
    let votes = (this.totalVoters - this.progress) / 2;
    return votes;
  }

  @computed get votesAgainstPercents() {
    if (this.totalVoters <= 0)
      return 0;

    let votesPercents = Math.round(this.votesAgainstNumber / this.totalVoters * 100);
    return votesPercents;
  }

  @action("Get start time of proxy ballot")
  getStartTime = async () => {
    const { contractsStore, id } = this.props;
    let startTime = await contractsStore.votingToChangeProxy.getStartTime(id);
    this.startTime = moment.utc(startTime * 1000).format('DD/MM/YYYY h:mm:ss A');
  }

  @action("Get end time of proxy ballot")
  getEndTime = async () => {
    const { contractsStore, id } = this.props;
    let endTime = await contractsStore.votingToChangeProxy.getEndTime(id);
    this.endTime = moment.utc(endTime * 1000).format('DD/MM/YYYY h:mm:ss A');
  }

  @action("Calculate time to finish")
  calcTimeToFinish = () => {
    const now = moment();
    const finish = moment.utc(this.endTime, 'DD/MM/YYYY h:mm:ss A');
    let ms = finish.diff(now);
    if (ms <= 0)
      return this.timeToFinish = moment(0, "h").format("HH") + ":" + moment(0, "m").format("mm") + ":" + moment(0, "s").format("ss");
    
    let dur = moment.duration(ms);
    this.timeToFinish = Math.floor(dur.asHours()) + moment.utc(ms).format(":mm:ss");
  }

  @action("Get times")
  getTimes = async () => {
    await this.getStartTime();
    await this.getEndTime();
    this.calcTimeToFinish();
  }

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

  @action("Get creator")
  getCreator = async () => {
    const { contractsStore, id } = this.props;
    let votingState = await contractsStore.votingToChangeProxy.votingState(id);
    this.getValidatorFullname(votingState.creator);
  }

  @action("Get validator full name")
  getValidatorFullname = async (_miningKey) => {
    const { contractsStore } = this.props;
    let validator = await contractsStore.validatorMetadata.validators(_miningKey);
    let firstName = toAscii(validator.firstName);
    let lastName = toAscii(validator.lastName);
    let fullName = `${firstName} ${lastName}`
    this.creator = fullName ? fullName : _miningKey;
  }

  @action("Get total voters")
  getTotalVoters = async () => {
    const { contractsStore, id } = this.props;
    let totalVoters = await contractsStore.votingToChangeProxy.getTotalVoters(id);
    this.totalVoters = Number(totalVoters);
  }

  @action("Get progress")
  getProgress = async () => {
    const { contractsStore, id } = this.props;
    let progress = await contractsStore.votingToChangeProxy.getProgress(id);
    this.progress = Number(progress);
  }

  @action("Get isFinalized")
  getIsFinalized = async () => {
    const { contractsStore, id } = this.props;
    this.isFinalized = await contractsStore.votingToChangeProxy.getIsFinalized(id);
  }

  isValidaVote = async () => {
    const { contractsStore, id } = this.props;
    let isValidVote = await contractsStore.votingToChangeProxy.isValidVote(id, contractsStore.votingKey);
    return isValidVote;
  }

  isActive = async () => {
    const { contractsStore, id } = this.props;
    let isActive = await contractsStore.votingToChangeProxy.isActive(id);
    return isActive;
  }

  vote = async (e, _type) => {
    const { commonStore, contractsStore, id } = this.props;
    const { push } = this.props.routing;
    if (!contractsStore.isValidVotingKey) {
      swal("Warning!", constants.INVALID_VOTING_KEY_MSG, "warning");
      return;
    }
    commonStore.showLoading();
    let isValidVote = await this.isValidaVote();
    if (!isValidVote) {
      commonStore.hideLoading();
      swal("Warning!", constants.INVALID_VOTE_MSG, "warning");
      return;
    }
    contractsStore.votingToChangeProxy.vote(id, _type, contractsStore.votingKey)
    .on("receipt", () => {
      commonStore.hideLoading();
      swal("Congratulations!", constants.VOTED_SUCCESS_MSG, "success").then((result) => {
        push(`${commonStore.rootPath}`);
      });
    })
    .on("error", (e) => {
      commonStore.hideLoading();
      swal("Error!", e.message, "error");
    });
  }

  finalize = async (e) => {
    const { commonStore, contractsStore, id } = this.props;
    const { push } = this.props.routing;
    if (!contractsStore.isValidVotingKey) {
      swal("Warning!", constants.INVALID_VOTING_KEY_MSG, "warning");
      return;
    }
    if (this.isFinalized) {
      swal("Warning!", constants.ALREADY_FINALIZED_MSG, "warning");
      return;
    }
    commonStore.showLoading();
    let isActive = await this.isActive();
    if (isActive) {
      commonStore.hideLoading();
      swal("Warning!", constants.INVALID_FINALIZE_MSG, "warning");
      return;
    }
    contractsStore.votingToChangeProxy.finalize(id, contractsStore.votingKey)
    .on("receipt", () => {
      commonStore.hideLoading();
      swal("Congratulations!", constants.FINALIZED_SUCCESS_MSG, "success").then((result) => {
        push(`${commonStore.rootPath}`);
      });
    })
    .on("error", (e) => {
      commonStore.hideLoading();
      swal("Error!", e.message, "error");
    });
  }

  constructor(props) {
    super(props);
    this.getTimes();
    this.getProposedAddress();
    this.getContractType();
    this.getCreator();
    this.getTotalVoters();
    this.getProgress();
    this.getIsFinalized();
  }

  hideCard = () => {
    let { commonStore } = this.props;
    let hideCard = commonStore.isActiveFilter && this.isFinalized;
    if (commonStore.searchTerm) {
      if (commonStore.searchTerm.length == 0) return hideCard;
      if (String(this.proposedAddress).toLowerCase().includes(commonStore.searchTerm)) return  (hideCard && false);
      if (String(this.contractType).toLowerCase().includes(commonStore.searchTerm)) return  (hideCard && false);
      if (String(this.creator).toLowerCase().includes(commonStore.searchTerm)) return  (hideCard && false);
    } else {
      return hideCard;
    }
    
    return true;
  }

  render () {
    const { commonStore, contractsStore, ballotStore } = this.props;
    let ballotClass = this.hideCard() ? "ballots-i display-none" : "ballots-i";
    return (
      <div className={ballotClass}>
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
            <button type="button" onClick={(e) => this.vote(e, 1)} className="ballots-i--vote ballots-i--vote_yes">Vote</button>
            <div className="vote-scale--container">
              <p className="vote-scale--value">Yes</p>
              <p className="vote-scale--votes">Votes: {this.votesForNumber}</p>
              <p className="vote-scale--percentage">{this.votesForPercents}%</p>
              <div className="vote-scale">
                <div className="vote-scale--fill vote-scale--fill_yes" style={{width: `${this.votesForPercents}%`}}></div>
              </div>
            </div>
          </div>
          <div className="ballots-i-scale-column">
            <div className="vote-scale--container">
              <p className="vote-scale--value">No</p>
              <p className="vote-scale--votes">Votes: {this.votesAgainstNumber}</p>
              <p className="vote-scale--percentage">{this.votesAgainstPercents}%</p>
              <div className="vote-scale">
                <div className="vote-scale--fill vote-scale--fill_no" style={{width: `${this.votesAgainstPercents}%`}}></div>
              </div>
            </div>
            <button type="button" onClick={(e) => this.vote(e, 2)} className="ballots-i--vote ballots-i--vote_no">Vote</button>
          </div>
        </div>
        <div className="info">
          Minimum {contractsStore.proxyBallotThreshold} from {contractsStore.validatorsLength} validators is required to pass the proposal
        </div>
        <hr />
        <div className="ballots-footer">
          <button type="button" onClick={(e) => this.finalize(e)} className="ballots-footer-finalize">Finalize ballot</button>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore</p>
        </div>
      </div>
    );
  }
}
