import React from "react";
import moment from "moment";
import { observable, action, computed } from "mobx";
import { inject, observer } from "mobx-react";
import { toAscii } from "../helpers";
import { constants } from "../constants";
import { messages } from "../messages";
import swal from "sweetalert2";

const ACCEPT = 1;
const REJECT = 2;
const USDateTimeFormat = "MM/DD/YYYY h:mm:ss A";
const zeroTimeTo = "00:00";
@inject("commonStore", "contractsStore", "ballotStore", "routing")
@observer
export class BallotCard extends React.Component {
    @observable startTime;
    @observable endTime;
    @observable timeTo = {};
    @observable timeToStart = {
        val: 0,
        displayValue: zeroTimeTo,
        title: "To start"
    };
    @observable timeToFinish = {
        val: 0,
        displayValue: zeroTimeTo,
        title: "To close"
    };
    @observable creator;
    @observable progress;
    @observable totalVoters;
    @observable isFinalized;

    @computed get finalizeButtonDisplayName() {
        const displayName = this.isFinalized ? "Finalized" : "Finalize ballot";
        return displayName;
    }

    @computed get finalizeButtonClass () {
        const cls = this.isFinalized ? "ballots-footer-finalize ballots-footer-finalize-finalized" : "ballots-footer-finalize";
        return cls;
    }

    @computed get votesForNumber() {
        let votes = (this.totalVoters + this.progress) / 2;
        return votes;
    }

    @computed get votesForPercents() {
        if (this.totalVoters <= 0) {
            return 0;
        }

        let votesPercents = Math.round(this.votesForNumber / this.totalVoters * 100);
        return votesPercents;
    }

    @computed get votesAgainstNumber() {
        let votes = (this.totalVoters - this.progress) / 2;
        return votes;
    }

    @computed get votesAgainstPercents() {
        if (this.totalVoters <= 0) {
            return 0;
        }

        let votesPercents = Math.round(this.votesAgainstNumber / this.totalVoters * 100);
        return votesPercents;
    }

    @action("Get start time of keys ballot")
    getStartTime = async () => {
        const { contractsStore, id, votingType } = this.props;
        let startTime = await this.getContract(contractsStore, votingType).getStartTime(id);
        this.startTime = moment.utc(startTime * 1000).format(USDateTimeFormat);
    }

    @action("Get end time of keys ballot")
    getEndTime = async () => {
        const { contractsStore, id, votingType } = this.props;
        let endTime = await this.getContract(contractsStore, votingType).getEndTime(id);
        this.endTime = moment.utc(endTime * 1000).format(USDateTimeFormat);
    }

    @action("Calculate time to start/finish")
    calcTimeTo = () => {
        const _now = moment();
        const start = moment.utc(this.startTime, USDateTimeFormat);
        const finish = moment.utc(this.endTime, USDateTimeFormat);
        let msStart = start.diff(_now);
        let msFinish = finish.diff(_now);

        if (msStart > 0) {
            this.timeToStart.val = msStart;
            this.timeToStart.displayValue = this.formatMs(msStart, ":mm:ss");
            return this.timeTo = this.timeToStart;
        }

        if (msFinish > 0) {
            this.timeToFinish.val = msFinish;
            this.timeToFinish.displayValue = this.formatMs(msFinish, ":mm:ss");
            return this.timeTo = this.timeToFinish;
        }

        this.timeToFinish.val = 0;
        this.timeToFinish.displayValue = zeroTimeTo;
        return this.timeTo = this.timeToFinish;
    }

    formatMs (ms, format) {
        let dur = moment.duration(ms);
        let hours = Math.floor(dur.asHours());
        hours = hours < 10 ? "0" + hours : hours;
        let formattedMs = hours + moment.utc(ms).format(":mm:ss");
        return formattedMs;
    }
    

    @action("Get times")
    getTimes = async () => {
        await this.getStartTime();
        await this.getEndTime();
        this.calcTimeTo();
    }

    @action("Get creator")
    getCreator = async () => {
        const { contractsStore, id, votingType } = this.props;
        let votingState = await this.getContract(contractsStore, votingType).votingState(id);
        this.getValidatorFullname(votingState.creator);
    }

    @action("Get progress")
    getProgress = async () => {
        const { contractsStore, id, votingType } = this.props;
        let progress = await this.getContract(contractsStore, votingType).getProgress(id);
        this.progress = Number(progress);
    }

    @action("Get total voters")
    getTotalVoters = async () => {
        const { contractsStore, id, votingType } = this.props;
        let totalVoters = await this.getContract(contractsStore, votingType).getTotalVoters(id);
        this.totalVoters = Number(totalVoters);
    }

    @action("Get isFinalized")
    getIsFinalized = async() => {
        const { contractsStore, id, votingType } = this.props;
        this.isFinalized = await this.getContract(contractsStore, votingType).getIsFinalized(id);
    }

    @action("Get validator full name")
    getValidatorFullname = async (_miningKey) => {
        const { contractsStore } = this.props;
        let validator = await contractsStore.validatorMetadata.validators(_miningKey);
        let firstName = toAscii(validator.firstName);
        let lastName = toAscii(validator.lastName);
        let fullName = `${firstName} ${lastName}`;
        this.creator = fullName ? fullName : _miningKey;
    }

    isValidaVote = async () => {
        const { contractsStore, id, votingType } = this.props;
        let isValidVote = await this.getContract(contractsStore, votingType).isValidVote(id, contractsStore.votingKey);
        return isValidVote;
    }

    isActive = async () => {
        const { contractsStore, id, votingType } = this.props;
        let isActive = await this.getContract(contractsStore, votingType).isActive(id);
        return isActive;
    }

    vote = async ({choice}) => {
        if (this.timeToStart.val > 0) {
            swal("Warning!", messages.BALLOT_IS_NOT_ACTIVE_MSG(this.timeTo.displayValue), "warning");
            return;
        }
        const { commonStore, contractsStore, id, votingType } = this.props;
        const { push } = this.props.routing;
        if (!contractsStore.isValidVotingKey) {
            swal("Warning!", messages.INVALID_VOTING_KEY_MSG, "warning");
            return;
        }
        commonStore.showLoading();
        let isValidVote = await this.isValidaVote();
        if (!isValidVote) {
            commonStore.hideLoading();
            swal("Warning!", messages.INVALID_VOTE_MSG, "warning");
            return;
        }
        this.getContract(contractsStore, votingType).vote(id, choice, contractsStore.votingKey)
        .on("receipt", () => {
            commonStore.hideLoading();
            swal("Congratulations!", messages.VOTED_SUCCESS_MSG, "success").then((result) => {
                push(`${commonStore.rootPath}`);
            });
        })
        .on("error", (e) => {
            commonStore.hideLoading();
            swal("Error!", e.message, "error");
        });
    }

    finalize = async (e) => {
        if (this.isFinalized) { return; }
        if (this.timeToStart.val > 0) {
            swal("Warning!", messages.BALLOT_IS_NOT_ACTIVE_MSG(this.timeTo.displayValue), "warning");
            return;
        }
        const { commonStore, contractsStore, id, votingType } = this.props;
        const { push } = this.props.routing;
        if (!contractsStore.isValidVotingKey) {
            swal("Warning!", messages.INVALID_VOTING_KEY_MSG, "warning");
            return;
        }
        if (this.isFinalized) {
            swal("Warning!", messages.ALREADY_FINALIZED_MSG, "warning");
            return;
        }
        commonStore.showLoading();
        let isActive = await this.isActive();
        if (isActive) {
            commonStore.hideLoading();
            swal("Warning!", messages.INVALID_FINALIZE_MSG, "warning");
            return;
        }
        this.getContract(contractsStore, votingType).finalize(id, contractsStore.votingKey)
        .on("receipt", () => {
            commonStore.hideLoading();
            swal("Congratulations!", messages.FINALIZED_SUCCESS_MSG, "success").then((result) => {
                push(`${commonStore.rootPath}`);
            });
        })
        .on("error", (e) => {
            commonStore.hideLoading();
            swal("Error!", e.message, "error");
        });
    }

    getContract(contractsStore, votingType) {
        switch(votingType) {
            case "votingToChangeKeys":
                return contractsStore.votingToChangeKeys;
            case "votingToChangeMinThreshold":
                return contractsStore.votingToChangeMinThreshold;
            case "votingToChangeProxy":
                return contractsStore.votingToChangeProxy;
            default:
                return contractsStore.votingToChangeKeys;
        }
    }

    getThreshold(contractsStore, votingType) {
        switch(votingType) {
          case "votingToChangeKeys":
            return contractsStore.keysBallotThreshold;
          case "votingToChangeMinThreshold":
            return contractsStore.minThresholdBallotThreshold;
          case "votingToChangeProxy":
            return contractsStore.proxyBallotThreshold;
          default:
            return contractsStore.keysBallotThreshold;
        }
    }

    constructor(props) {
        super(props);
        this.isFinalized = false;
        this.getTimes();
        this.getCreator();
        this.getTotalVoters();
        this.getProgress();
        this.getIsFinalized();
    }

    componentDidMount() {
        this.interval = setInterval(() => {
            this.calcTimeTo();
        }, 1000);
    }

    componentWillUnmount() {
        window.clearInterval(this.interval);
    }

    showCard = () => {
        let { commonStore } = this.props;
        let show = commonStore.isActiveFilter ? !this.isFinalized : true;
        return show;
    }

    isCreatorPattern = () => {
        let { commonStore } = this.props;
        if (commonStore.searchTerm) {
            if (commonStore.searchTerm.length > 0) {
                const isCreatorPattern = String(this.creator).toLowerCase().includes(commonStore.searchTerm);
                return  isCreatorPattern;
            }
        }
        return true;
    }

    render () {
        let { contractsStore, votingType, children, isSearchPattern } = this.props;
        let ballotClass = (this.showCard() && (this.isCreatorPattern() || isSearchPattern)) ? "ballots-i" : "ballots-i display-none";
        const threshold = this.getThreshold(contractsStore, votingType);
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
              {children}
              <div className="ballots-about-i ballots-about-i_time">
                <div className="ballots-about-td">
                  <p className="ballots-about-i--title">Time</p>
                </div>
                <div className="ballots-about-td">
                  <p className="ballots-i--time">{this.timeTo.displayValue}</p>
                  <p className="ballots-i--to-close">{this.timeTo.title}</p>
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
              Minimum {threshold} from {contractsStore.validatorsLength} validators is required to pass the proposal
            </div>
            <hr />
            <div className="ballots-footer">
              <div className="ballots-footer-left">
                <button type="button" onClick={(e) => this.finalize(e)} className={this.finalizeButtonClass}>{this.finalizeButtonDisplayName}</button>
                <p>{constants.CARD_FINALIZE_DESCRIPTION}</p>
              </div>
              <div type="button" className="ballots-i--vote ballots-i--vote_no">Proxy Ballot ID: {this.props.id}</div>
            </div>
          </div>
        );
    }
}
