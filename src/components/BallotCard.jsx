import React from "react";
import moment from "moment";
import { observable, action, computed } from "mobx";
import { inject, observer } from "mobx-react";
import { messages } from "../messages";
import swal from "sweetalert2";

const ACCEPT = 1;
const REJECT = 2;
const USDateTimeFormat = "MM/DD/YYYY h:mm:ss A";

const zeroTimeTo = "00:00";

@inject("commonStore", "contractsStore", "routing", "ballotsStore")
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
    @observable creatorMiningKey;
    @observable creator;
    @observable progress;
    @observable totalVoters;
    @observable isFinalized;
    @observable canBeFinalized;
    @observable hasAlreadyVoted;
    @observable memo;

    @computed get finalizeButtonDisplayName() {
        const displayName = this.isFinalized ? "Finalized" : "Finalize ballot";
        return displayName;
    }

    @computed get finalizeButtonClass () {
        const cls = this.isFinalized ? "ballots-footer-finalize ballots-footer-finalize-finalized" : "ballots-footer-finalize";
        return cls;
    }

    @computed get finalizeDescription () {
        if (this.isFinalized) {
            return '';
        }
        let description = 'Finalization is available after ballot time is finished';
        if (this.canBeFinalized !== null) {
            description += ' or all validators are voted';
        }
        return description;
    }

    @computed get votesForNumber() {
        let votes = (this.totalVoters + this.progress) / 2;
        if (isNaN(votes))
            votes = 0;
        return votes;
    }

    @computed get votesForPercents() {
        if (this.totalVoters <= 0) {
            return 0;
        }

        let votesPercents = Math.round(this.votesForNumber / this.totalVoters * 100);
        if (isNaN(votesPercents))
            votesPercents = 0;
        return votesPercents;
    }

    @computed get votesAgainstNumber() {
        let votes = (this.totalVoters - this.progress) / 2;
        if (isNaN(votes))
            votes = 0;
        return votes;
    }

    @computed get votesAgainstPercents() {
        if (this.totalVoters <= 0) {
            return 0;
        }

        let votesPercents = Math.round(this.votesAgainstNumber / this.totalVoters * 100);
        if (isNaN(votesPercents))
            votesPercents = 0;
        return votesPercents;
    }

    @action("Calculate time to start/finish")
    calcTimeTo = () => {
        const _now = moment();
        const start = moment.utc(this.startTime, USDateTimeFormat);
        const finish = moment.utc(this.endTime, USDateTimeFormat);
        let msStart = start.diff(_now);
        let msFinish = finish.diff(_now);

        if (msStart > 0) {
            this.timeToStart.val = msStart + 5000;
            this.timeToStart.displayValue = this.formatMs(msStart, ":mm:ss");
            return this.timeTo = this.timeToStart;
        }

        if (msFinish > 0) {
            this.timeToStart.val = 0;
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

    @action("validator has already voted")
    getHasAlreadyVoted = async () => {
        const { contractsStore, id, votingType } = this.props;
        let _hasAlreadyVoted = false;
        try {
            _hasAlreadyVoted = await this.getContract(contractsStore, votingType).hasAlreadyVoted(id, contractsStore.votingKey);
        } catch(e) {
            console.log(e.message);
        }
        this.hasAlreadyVoted = _hasAlreadyVoted;
    }

    isValidVote = async () => {
        const { contractsStore, id, votingType } = this.props;
        let _isValidVote;
        try {
            _isValidVote = await this.getContract(contractsStore, votingType).isValidVote(id, contractsStore.votingKey);
        } catch(e) {
            console.log(e.message);
        }
        return _isValidVote;
    }

    isActive = async () => {
        const { contractsStore, id, votingType } = this.props;
        let _isActive = await this.repeatGetProperty(contractsStore, votingType, id, "isActive", 0);
        return _isActive;
    }

    canBeFinalizedNow = async () => {
        const { contractsStore, id, votingType } = this.props;
        let _canBeFinalizedNow = await this.repeatGetProperty(contractsStore, votingType, id, "canBeFinalizedNow", 0);
        this.canBeFinalized = _canBeFinalizedNow;
    }

    vote = async ({choice}) => {
        if (this.timeToStart.val > 0) {
            swal("Warning!", messages.ballotIsNotActiveMsg(this.timeTo.displayValue), "warning");
            return;
        }
        const { commonStore, contractsStore, id, votingType, ballotsStore } = this.props;
        const { push } = this.props.routing;
        if (!contractsStore.isValidVotingKey) {
            swal("Warning!", messages.invalidVotingKeyMsg(contractsStore.votingKey), "warning");
            return;
        }
        commonStore.showLoading();
        let isValidVote = await this.isValidVote();
        if (!isValidVote) {
            commonStore.hideLoading();
            swal("Warning!", messages.INVALID_VOTE_MSG, "warning");
            return;
        }
        const contract = this.getContract(contractsStore, votingType);
        contract.vote(id, choice, contractsStore.votingKey)
        .on("receipt", async (tx) => {
            commonStore.hideLoading();
            if (tx.status === true || tx.status === '0x1') {
                const ballotInfo = await contract.getBallotInfo(id, contractsStore.votingKey);

                this.totalVoters = Number(ballotInfo.totalVoters);
                this.progress = Number(ballotInfo.progress);
                this.isFinalized = Boolean(ballotInfo.isFinalized);
                if (ballotInfo.hasOwnProperty('canBeFinalizedNow')) {
                    this.canBeFinalized = Boolean(ballotInfo.canBeFinalizedNow);
                } else {
                    await this.canBeFinalizedNow();
                }
                this.hasAlreadyVoted = true;

                ballotsStore.ballotCards[this.props.pos].props.votingState.totalVoters = this.totalVoters;
                ballotsStore.ballotCards[this.props.pos].props.votingState.progress = this.progress;
                ballotsStore.ballotCards[this.props.pos].props.votingState.isFinalized = this.isFinalized;
                ballotsStore.ballotCards[this.props.pos].props.votingState.canBeFinalized = this.canBeFinalized;
                ballotsStore.ballotCards[this.props.pos].props.votingState.hasAlreadyVoted = this.hasAlreadyVoted;

                swal("Congratulations!", messages.VOTED_SUCCESS_MSG, "success").then((result) => {
                    push(`${commonStore.rootPath}`);
                });
            } else {
                swal("Warning!", messages.VOTE_FAILED_TX, "warning").then((result) => {
                });
            }
        })
        .on("error", (e) => {
            commonStore.hideLoading();
            swal("Error!", e.message, "error");
        });
    }

    finalize = async (e) => {
        if (this.isFinalized) {
            return;
        }

        if (this.timeToStart.val > 0) {
            swal("Warning!", messages.ballotIsNotActiveMsg(this.timeTo.displayValue), "warning");
            return;
        }
        const { commonStore, contractsStore, id, votingType, ballotsStore } = this.props;
        const { push } = this.props.routing;
        if (!contractsStore.isValidVotingKey) {
            swal("Warning!", messages.invalidVotingKeyMsg(contractsStore.votingKey), "warning");
            return;
        }
        if (this.isFinalized) {
            swal("Warning!", messages.ALREADY_FINALIZED_MSG, "warning");
            return;
        }
        commonStore.showLoading();
        await this.canBeFinalizedNow();
        let _canBeFinalized = this.canBeFinalized;
        if (_canBeFinalized === null) {
            console.log('canBeFinalizedNow is not existed');
            _canBeFinalized = !(await this.isActive());
        }
        if (!_canBeFinalized) {
            commonStore.hideLoading();
            swal("Warning!", messages.INVALID_FINALIZE_MSG, "warning");
            return;
        }
        this.getContract(contractsStore, votingType).finalize(id, contractsStore.votingKey)
        .on("receipt", (tx) => {
            commonStore.hideLoading();
            if (tx.status === true || tx.status === '0x1') {
                this.isFinalized = true;
                ballotsStore.ballotCards[this.props.pos].props.votingState.isFinalized = this.isFinalized;
                if (this.canBeFinalized !== null) {
                    this.canBeFinalized = false;
                    ballotsStore.ballotCards[this.props.pos].props.votingState.canBeFinalized = this.canBeFinalized;
                }
                swal("Congratulations!", messages.FINALIZED_SUCCESS_MSG, "success").then((result) => {
                    push(`${commonStore.rootPath}`);
                });
            } else {
                swal("Warning!", messages.FINALIZE_FAILED_TX, "warning").then((result) => {
                });
            }
        })
        .on("error", (e) => {
            commonStore.hideLoading();
            swal("Error!", e.message, "error");
        });
    }

    repeatGetProperty = async (contractsStore, contractType, id, methodID, tryID) => {
        try {
            let val = await this.getContract(contractsStore, contractType)[methodID](id);
            if (tryID > 0) {
                console.log(`success from Try ${tryID + 1}`);
            }
            return val;
        } catch(e) {
            if (tryID < 10) {
                console.log(`trying to repeat get value again... Try ${tryID + 1}`);
                tryID++;
                await setTimeout(async () => {
                    this.repeatGetProperty(contractsStore, contractType, id, methodID, tryID);
                }, 1000)
            } else {
                return null;
            }
        }
    }

    getContract(contractsStore, contractType) {
        switch(contractType) {
            case "votingToChangeKeys":
                return contractsStore.votingToChangeKeys;
            case "votingToChangeMinThreshold":
                return contractsStore.votingToChangeMinThreshold;
            case "votingToChangeProxy":
                return contractsStore.votingToChangeProxy;
            case "validatorMetadata":
                return contractsStore.validatorMetadata;
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
        const { votingState } = this.props;
        // getTimes
        this.startTime = moment.utc(votingState.startTime * 1000).format(USDateTimeFormat);
        this.endTime = moment.utc(votingState.endTime * 1000).format(USDateTimeFormat);
        this.calcTimeTo();
        // getCreator
        this.creator = votingState.creator;
        this.creatorMiningKey = votingState.creatorMiningKey;
        // getTotalVoters
        this.totalVoters = Number(votingState.totalVoters);
        // getProgress
        this.progress = Number(votingState.progress);
        // getIsFinalized
        this.isFinalized = votingState.isFinalized;
        // canBeFinalizedNow
        this.canBeFinalized = votingState.hasOwnProperty('canBeFinalizedNow') ? votingState.canBeFinalizedNow : null;
        // getMemo
        this.memo = votingState.memo;
        // hasAlreadyVoted
        if (votingState.hasOwnProperty('hasAlreadyVoted')) {
            this.hasAlreadyVoted = votingState.hasAlreadyVoted;
        } else {
            this.getHasAlreadyVoted();
        }
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
        let checkToFinalizeFilter = commonStore.isToFinalizeFilter ? !this.isFinalized && (this.timeToFinish.val === 0 || this.canBeFinalized) && this.timeToStart.val === 0 : true;
        let show = commonStore.isActiveFilter ? !this.isFinalized : checkToFinalizeFilter;
        return show;
    }

    typeName(type){
        switch(type) {
            case "votingToChangeMinThreshold":
                return "Consensus";
            case "votingToChangeKeys":
                return "Keys";
            case "votingToChangeProxy":
                return "Proxy";
            default:
                return "";
        }
    }

    render () {
        let { contractsStore, votingType, children } = this.props;
        let ballotClass = this.showCard() ? this.isFinalized ? "ballots-i" : "ballots-i ballots-i-not-finalized" : "ballots-i display-none";
        let voteScaleClass = this.isFinalized ? "vote-scale" : "vote-scale vote-scale-not-finalized";
        let hasAlreadyVotedLabel = <div className="ballots-i--vote ballots-i--vote-label ballots-i--vote-label-right ballots-i--vote_no">You already voted</div>;
        let showHasAlreadyVotedLabel = this.hasAlreadyVoted ? hasAlreadyVotedLabel : "";
        const threshold = this.getThreshold(contractsStore, votingType);
        return (
          <div className={ballotClass}>
            <div className="ballots-about">
              <div className="ballots-about-i ballots-about-i_name">
                <div className="ballots-about-td">
                  <p className="ballots-about-i--title">Proposer</p>
                </div>
                <div className="ballots-about-td">
                  <p className="ballots-i--name">{this.creator}</p>
                  <p className="ballots-i--created">{this.startTime}</p>
                </div>
              </div>
              {children}
              <div className="ballots-about-i ballots-about-i_time">
                <div className="ballots-about-td">
                  <p className="ballots-about-i--title">Ballot Time</p>
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
                  <div className={voteScaleClass}>
                    <div className="vote-scale--fill vote-scale--fill_yes" style={{width: `${this.votesAgainstPercents}%`}}></div>
                  </div>
                </div>
              </div>
              <div className="ballots-i-scale-column">
                <div className="vote-scale--container">
                  <p className="vote-scale--value">Yes</p>
                  <p className="vote-scale--votes">Votes: {this.votesForNumber}</p>
                  <p className="vote-scale--percentage">{this.votesForPercents}%</p>
                  <div className={voteScaleClass}>
                    <div className="vote-scale--fill vote-scale--fill_no" style={{width: `${this.votesForPercents}%`}}></div>
                  </div>
                </div>
                <button type="button" onClick={(e) => this.vote({choice: ACCEPT})} className="ballots-i--vote ballots-i--vote_yes">Yes</button>
              </div>
            </div>
            <div className="info">
              Minimum {threshold} from {contractsStore.validatorsLength} validators are required to pass the proposal
            </div>
            <div className="info">
              {this.memo}
            </div>
            <hr />
            <div className="ballots-footer">
              <div className="ballots-footer-left">
                <button type="button" onClick={(e) => this.finalize(e)} className={this.finalizeButtonClass}>{this.finalizeButtonDisplayName}</button>
                <p>{this.finalizeDescription}</p>
              </div>
              {showHasAlreadyVotedLabel}
              <div className="ballots-i--vote ballots-i--vote-label ballots-i--vote_no">{this.typeName(votingType)} Ballot ID: {this.props.id}</div>
            </div>
          </div>
        );
    }
}