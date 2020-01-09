import React from 'react'
import moment from 'moment'
import swal from 'sweetalert2'
import { BallotDataPair } from '../BallotDataPair'
import { BallotFooter } from '../BallotFooter'
import { BallotInfoContainer } from '../BallotInfoContainer'
import { Votes } from '../Votes'
import { getNetworkBranch } from '../../utils/utils'
import { inject, observer } from 'mobx-react'
import messages from '../../utils/messages'
import { observable, action, computed } from 'mobx'
import { sendTransactionByVotingKey } from '../../utils/helpers'
import { enableWallet } from '../../utils/getWeb3'

const ACCEPT = 1
const REJECT = 2
const SEND = 1
const BURN = 2
const FREEZE = 3
const USDateTimeFormat = 'MM/DD/YYYY h:mm:ss A'
const zeroTimeTo = '00:00'

@inject('commonStore', 'contractsStore', 'routing', 'ballotsStore')
@observer
export class BallotCard extends React.Component {
  @observable cancelDeadline = 0
  @observable nowTimeUnix
  @observable startTime
  @observable startTimeUnix
  @observable endTime
  @observable timeTo = {}
  @observable
  timeToStart = {
    val: 0,
    displayValue: zeroTimeTo,
    title: 'To start'
  }
  @observable
  timeToFinish = {
    val: 0,
    displayValue: zeroTimeTo,
    title: 'To close'
  }
  @observable
  timeToCancel = {
    val: 0,
    displayValue: zeroTimeTo
  }
  @observable creatorMiningKey
  @observable creator
  @observable progress
  @observable totalVoters
  @observable burnVotes
  @observable freezeVotes
  @observable sendVotes
  @observable isFinalized
  @observable isCanceled = false
  @observable canBeFinalized
  @observable hasAlreadyVoted
  @observable memo
  @observable quorumState
  @observable minBallotDuration
  @observable minThreshold

  @computed
  get cancelOrFinalizeButtonDisplayName() {
    if (this.isFinalized) {
      return 'Finalized'
    } else if (this.isCanceled) {
      return 'Canceled'
    } else if (this.timeToCancel.val > 0) {
      return 'Cancel ballot'
    } else {
      return 'Finalize ballot'
    }
  }

  @computed
  get cancelOrFinalizeButtonState() {
    if (this.isFinalized || this.isCanceled) {
      return 'disabled'
    } else if (this.timeToCancel.val > 0) {
      return 'danger'
    }
  }

  @computed
  get cancelOrFinalizeDescription() {
    if (this.isFinalized) {
      if (this.props.votingType === 'votingToManageEmissionFunds') {
        switch (Number(this.quorumState)) {
          case 2:
            return 'The funds were sent to the proposed receiver address.'
          case 3:
            return 'The funds were burnt.'
          case 4:
            return 'The funds were frozen.'
          default:
            return 'Unknown error'
        }
      }
      return ''
    } else if (this.isCanceled) {
      return ''
    } else if (this.timeToCancel.val > 0) {
      return `You can cancel this ballot within ${this.timeToCancel.displayValue}`
    } else {
      let description = 'Finalization is available after ballot time is finished'
      if (this.canBeFinalized !== null && this.nowTimeUnix - this.startTimeUnix > this.minBallotDuration) {
        description += ' or all validators are voted'
      }
      return description
    }
  }

  @computed
  get votesForNumber() {
    let votes = (this.totalVoters + this.progress) / 2
    if (isNaN(votes)) votes = 0
    return votes
  }

  @computed
  get votesForPercents() {
    if (this.totalVoters <= 0) {
      return 0
    }

    let votesPercents = Math.round((this.votesForNumber / this.totalVoters) * 100)
    if (isNaN(votesPercents)) votesPercents = 0
    return votesPercents
  }

  @computed
  get votesAgainstNumber() {
    let votes = (this.totalVoters - this.progress) / 2
    if (isNaN(votes)) votes = 0
    return votes
  }

  @computed
  get votesAgainstPercents() {
    if (this.totalVoters <= 0) {
      return 0
    }

    let votesPercents = Math.round((this.votesAgainstNumber / this.totalVoters) * 100)
    if (isNaN(votesPercents)) votesPercents = 0
    return votesPercents
  }

  @computed
  get votesBurnNumber() {
    let votes = this.burnVotes
    if (isNaN(votes)) votes = 0
    return votes
  }

  @computed
  get votesBurnPercents() {
    if (this.totalVoters <= 0) {
      return 0
    }

    let votesPercents = Math.round((this.votesBurnNumber / this.totalVoters) * 100)
    if (isNaN(votesPercents)) votesPercents = 0
    return votesPercents
  }

  @computed
  get votesFreezeNumber() {
    let votes = this.freezeVotes
    if (isNaN(votes)) votes = 0
    return votes
  }

  @computed
  get votesFreezePercents() {
    if (this.totalVoters <= 0) {
      return 0
    }

    let votesPercents = Math.round((this.votesFreezeNumber / this.totalVoters) * 100)
    if (isNaN(votesPercents)) votesPercents = 0
    return votesPercents
  }

  @computed
  get votesSendNumber() {
    let votes = this.sendVotes
    if (isNaN(votes)) votes = 0
    return votes
  }

  @computed
  get votesSendPercents() {
    if (this.totalVoters <= 0) {
      return 0
    }

    let votesPercents = Math.round((this.votesSendNumber / this.totalVoters) * 100)
    if (isNaN(votesPercents)) votesPercents = 0
    return votesPercents
  }

  @action('Calculate time to start/finish')
  calcTimeTo = () => {
    const _now = moment()
    const cancel = moment.utc(this.cancelDeadline, USDateTimeFormat)
    const start = moment.utc(this.startTime, USDateTimeFormat)
    const finish = moment.utc(this.endTime, USDateTimeFormat)
    const msCancel = cancel.diff(_now)
    const msStart = start.diff(_now)
    const msFinish = finish.diff(_now)

    this.nowTimeUnix = moment()
      .utc()
      .unix()

    if (msCancel > 0 && !this.isCanceled) {
      this.timeToCancel.val = msCancel
      this.timeToCancel.displayValue = this.formatMs(msCancel, ':mm:ss')
    } else {
      this.timeToCancel.val = 0
      this.timeToCancel.displayValue = zeroTimeTo
    }

    if (msStart > 0 && !this.isCanceled) {
      this.timeToStart.val = msStart + 5000
      this.timeToStart.displayValue = this.formatMs(msStart, ':mm:ss')
      return (this.timeTo = this.timeToStart)
    }

    if (msFinish > 0 && !this.isCanceled) {
      this.timeToStart.val = 0
      this.timeToFinish.val = msFinish
      this.timeToFinish.displayValue = this.formatMs(msFinish, ':mm:ss')
      return (this.timeTo = this.timeToFinish)
    }

    this.timeToFinish.val = 0
    this.timeToFinish.displayValue = zeroTimeTo
    return (this.timeTo = this.timeToFinish)
  }

  constructor(props) {
    super(props)
    const { votingState, contractsStore, votingType } = this.props
    // getTimes
    if (
      votingState.hasOwnProperty('creationTime') &&
      contractsStore.ballotCancelingThreshold > 0 &&
      votingState.creatorMiningKey === contractsStore.miningKey
    ) {
      votingState.creationTime = Number(votingState.creationTime)
      this.cancelDeadline = moment
        .utc((votingState.creationTime + contractsStore.ballotCancelingThreshold) * 1000)
        .format(USDateTimeFormat)
    }
    this.startTimeUnix = moment.utc(votingState.startTime * 1000) / 1000
    this.startTime = moment.utc(votingState.startTime * 1000).format(USDateTimeFormat)
    this.endTime = moment.utc(votingState.endTime * 1000).format(USDateTimeFormat)
    // getCreator
    this.creator = votingState.creator
    this.creatorMiningKey = votingState.creatorMiningKey
    // getTotalVoters
    if (votingState.hasOwnProperty('totalVoters')) {
      this.totalVoters = Number(votingState.totalVoters)
    } else {
      this.burnVotes = Number(votingState.burnVotes)
      this.freezeVotes = Number(votingState.freezeVotes)
      this.sendVotes = Number(votingState.sendVotes)
      this.totalVoters = this.burnVotes + this.freezeVotes + this.sendVotes
    }

    // getProgress
    if (votingState.hasOwnProperty('progress')) {
      this.progress = Number(votingState.progress)
    }

    // getIsFinalized
    this.isFinalized = votingState.isFinalized

    // getIsCanceled
    if (votingState.hasOwnProperty('isCanceled')) {
      this.isCanceled = votingState.isCanceled
    }
    this.calcTimeTo()

    // canBeFinalizedNow
    if (votingState.hasOwnProperty('canBeFinalizedNow')) {
      this.canBeFinalized = votingState.canBeFinalizedNow
    } else {
      this.canBeFinalizedNow()
    }

    // getMemo
    this.memo = votingState.memo

    // hasAlreadyVoted
    if (votingState.hasOwnProperty('alreadyVoted')) {
      this.hasAlreadyVoted = votingState.alreadyVoted
    } else {
      this.getHasAlreadyVoted()
    }

    // minThreshold
    this.getMinThreshold()

    if (votingType === 'votingToManageEmissionFunds') {
      this.getQuorumState()
    }

    this.minBallotDuration = this.getMinBallotDuration(contractsStore, votingType)
  }

  formatMs(ms, format) {
    let dur = moment.duration(ms)
    let hours = Math.floor(dur.asHours())
    hours = hours < 10 ? '0' + hours : hours
    let formattedMs = hours + moment.utc(ms).format(':mm:ss')
    return formattedMs
  }

  @action('ballot min threshold of voters')
  getMinThreshold = async () => {
    const { contractsStore, id, votingType } = this.props
    this.minThreshold = await this.getContract(contractsStore, votingType).getMinThresholdOfVoters(id)
  }

  @action('validator has already voted')
  getHasAlreadyVoted = async () => {
    const { contractsStore, id, votingType } = this.props
    if (contractsStore.miningKey === '0x0000000000000000000000000000000000000000') {
      this.hasAlreadyVoted = false
      return
    }
    let _hasAlreadyVoted = false
    try {
      _hasAlreadyVoted = await this.getContract(contractsStore, votingType).hasAlreadyVoted(
        id,
        contractsStore.votingKey
      )
    } catch (e) {
      console.error(e.message)
    }
    this.hasAlreadyVoted = _hasAlreadyVoted
  }

  isValidVote = async () => {
    const { contractsStore, id, votingType } = this.props
    let _isValidVote
    try {
      _isValidVote = await this.getContract(contractsStore, votingType).isValidVote(id, contractsStore.votingKey)
    } catch (e) {
      console.error(e.message)
    }
    return _isValidVote
  }

  isActive = async () => {
    const { contractsStore, id, votingType } = this.props
    let _isActive = await this.repeatGetProperty(contractsStore, votingType, id, 'isActive', 0)
    return _isActive
  }

  canBeFinalizedNow = async () => {
    const { contractsStore, id, votingType } = this.props
    let _canBeFinalizedNow = await this.repeatGetProperty(contractsStore, votingType, id, 'canBeFinalizedNow', 0)
    this.canBeFinalized = _canBeFinalizedNow
  }

  getQuorumState = async () => {
    const { contractsStore, id, votingType } = this.props
    this.quorumState = await this.repeatGetProperty(contractsStore, votingType, id, 'getQuorumState', 0)
  }

  networkAndKeyValidation = async () => {
    const { contractsStore } = this.props
    try {
      await enableWallet(contractsStore.updateKeys)
    } catch (error) {
      swal('Error', error.message, 'error')
      return false
    }
    if (contractsStore.isEmptyVotingKey) {
      swal('Warning!', messages.NO_METAMASK_MSG, 'warning')
      return false
    } else if (!contractsStore.networkMatch) {
      swal('Warning!', messages.networkMatchError(contractsStore.netId), 'warning')
      return false
    } else if (!contractsStore.isValidVotingKey) {
      swal('Warning!', messages.invalidVotingKeyMsg(contractsStore.votingKey), 'warning')
      return false
    }
    return true
  }

  vote = async ({ choice }) => {
    if (this.isCanceled) {
      swal('Warning!', messages.INVALID_VOTE_MSG, 'warning')
      return
    }
    if (this.timeToStart.val > 0) {
      swal('Warning!', messages.ballotIsNotActiveMsg(this.timeTo.displayValue), 'warning')
      return
    }

    if (!(await this.networkAndKeyValidation())) {
      return
    }

    const { commonStore, contractsStore, id, votingType, ballotsStore, pos } = this.props
    const { push } = this.props.routing
    commonStore.showLoading()
    let isValidVote = await this.isValidVote()
    if (!isValidVote) {
      commonStore.hideLoading()
      swal('Warning!', messages.INVALID_VOTE_MSG, 'warning')
      return
    }

    const contract = this.getContract(contractsStore, votingType)

    sendTransactionByVotingKey(
      this.props,
      contract.address,
      contract.vote(id, choice),
      async tx => {
        const ballotInfo = await contract.getBallotInfo(id, contractsStore.votingKey)

        if (ballotInfo.hasOwnProperty('totalVoters')) {
          this.totalVoters = Number(ballotInfo.totalVoters)
        } else {
          this.burnVotes = ballotInfo.burnVotes
          this.freezeVotes = ballotInfo.freezeVotes
          this.sendVotes = ballotInfo.sendVotes
          this.totalVoters =
            Number(ballotInfo.burnVotes) + Number(ballotInfo.freezeVotes) + Number(ballotInfo.sendVotes)
        }
        if (ballotInfo.hasOwnProperty('progress')) {
          this.progress = Number(ballotInfo.progress)
        }
        this.isFinalized = Boolean(ballotInfo.isFinalized)
        if (ballotInfo.hasOwnProperty('isCanceled')) {
          this.isCanceled = Boolean(ballotInfo.isCanceled)
        }
        if (ballotInfo.hasOwnProperty('canBeFinalizedNow')) {
          this.canBeFinalized = Boolean(ballotInfo.canBeFinalizedNow)
        } else {
          await this.canBeFinalizedNow()
        }
        this.hasAlreadyVoted = true

        if (ballotInfo.hasOwnProperty('totalVoters')) {
          ballotsStore.ballotCards[pos].props.votingState.totalVoters = this.totalVoters
        } else {
          ballotsStore.ballotCards[pos].props.votingState.burnVotes = this.burnVotes
          ballotsStore.ballotCards[pos].props.votingState.freezeVotes = this.freezeVotes
          ballotsStore.ballotCards[pos].props.votingState.sendVotes = this.sendVotes
        }
        if (ballotInfo.hasOwnProperty('progress')) {
          ballotsStore.ballotCards[pos].props.votingState.progress = this.progress
        }
        ballotsStore.ballotCards[pos].props.votingState.isFinalized = this.isFinalized
        ballotsStore.ballotCards[pos].props.votingState.isCanceled = this.isCanceled
        ballotsStore.ballotCards[pos].props.votingState.canBeFinalized = this.canBeFinalized
        ballotsStore.ballotCards[pos].props.votingState.hasAlreadyVoted = this.hasAlreadyVoted

        swal('Congratulations!', messages.VOTED_SUCCESS_MSG, 'success').then(result => {
          push(`${commonStore.rootPath}`)
        })
      },
      messages.VOTE_FAILED_TX
    )
  }

  cancelOrFinalize = e => {
    if (this.isFinalized || this.isCanceled) {
      return
    }
    if (this.timeToCancel.val > 0) {
      this.cancel(e)
    } else {
      this.finalize(e)
    }
  }

  cancel = async e => {
    const { votingState, contractsStore, commonStore, ballotsStore, votingType, id, pos } = this.props
    const { push } = this.props.routing
    const contract = this.getContract(contractsStore, votingType)

    if (!(await this.networkAndKeyValidation())) {
      return
    }

    let canCancel = true

    if (!this.timeToCancel.val) {
      canCancel = false
    }
    if (votingState.creatorMiningKey.toLowerCase() !== contractsStore.miningKey.toLowerCase()) {
      canCancel = false
    }
    commonStore.showLoading()
    if (!votingState.creationTime) {
      canCancel = false
    } else {
      const currentTime = Number(await contract.getTime())
      if (currentTime - votingState.creationTime > contractsStore.ballotCancelingThreshold) {
        canCancel = false
      }
    }

    if (!canCancel) {
      commonStore.hideLoading()
      swal('Warning!', messages.INVALID_CANCEL_MSG, 'warning')
      return
    }

    sendTransactionByVotingKey(
      this.props,
      contract.address,
      contract.cancelBallot(id),
      async tx => {
        this.isFinalized = false
        this.isCanceled = true
        ballotsStore.ballotCards[pos].props.votingState.isFinalized = this.isFinalized
        ballotsStore.ballotCards[pos].props.votingState.isCanceled = this.isCanceled
        if (this.canBeFinalized !== null) {
          this.canBeFinalized = false
          ballotsStore.ballotCards[pos].props.votingState.canBeFinalized = this.canBeFinalized
        }
        swal('Congratulations!', messages.CANCELED_SUCCESS_MSG, 'success').then(result => {
          push(`${commonStore.rootPath}`)
        })
      },
      messages.CANCEL_BALLOT_FAILED_TX
    )
  }

  finalize = async e => {
    if (this.timeToStart.val > 0) {
      swal('Warning!', messages.ballotIsNotActiveMsg(this.timeTo.displayValue), 'warning')
      return
    }
    const { commonStore, contractsStore, id, votingType, ballotsStore, pos } = this.props
    const { push } = this.props.routing

    if (!(await this.networkAndKeyValidation())) {
      return
    }

    if (this.isFinalized) {
      swal('Warning!', messages.ALREADY_FINALIZED_MSG, 'warning')
      return
    }
    commonStore.showLoading()
    await this.canBeFinalizedNow()
    let _canBeFinalized = this.canBeFinalized
    if (_canBeFinalized === null) {
      console.log('canBeFinalizedNow does not exist')
      _canBeFinalized = !(await this.isActive())
    }
    if (!_canBeFinalized) {
      commonStore.hideLoading()
      swal('Warning!', messages.INVALID_FINALIZE_MSG, 'warning')
      return
    }

    const contract = this.getContract(contractsStore, votingType)

    sendTransactionByVotingKey(
      this.props,
      contract.address,
      contract.finalize(id),
      async tx => {
        const events = await contract.instance.getPastEvents('BallotFinalized', {
          fromBlock: tx.blockNumber,
          toBlock: tx.blockNumber
        })
        if (events.length > 0) {
          this.isFinalized = true
          this.isCanceled = false
          ballotsStore.ballotCards[pos].props.votingState.isFinalized = this.isFinalized
          ballotsStore.ballotCards[pos].props.votingState.isCanceled = this.isCanceled
          if (this.canBeFinalized !== null) {
            this.canBeFinalized = false
            ballotsStore.ballotCards[pos].props.votingState.canBeFinalized = this.canBeFinalized
          }
          swal('Congratulations!', messages.FINALIZED_SUCCESS_MSG, 'success').then(result => {
            push(`${commonStore.rootPath}`)
          })
        } else {
          swal('Warning!', messages.INVALID_FINALIZE_MSG, 'warning')
        }
      },
      messages.FINALIZE_FAILED_TX
    )
  }

  repeatGetProperty = async (contractsStore, contractType, id, methodID, tryID) => {
    try {
      let val = await this.getContract(contractsStore, contractType)[methodID](id)
      if (tryID > 0) {
        console.log(`success from Try ${tryID + 1}`)
      }
      return val
    } catch (e) {
      if (tryID < 10) {
        console.log(`trying to repeat get value again... Try ${tryID + 1}`)
        tryID++
        await setTimeout(async () => {
          this.repeatGetProperty(contractsStore, contractType, id, methodID, tryID)
        }, 1000)
      } else {
        return null
      }
    }
  }

  getContract(contractsStore, contractType) {
    switch (contractType) {
      case 'votingToChangeKeys':
        return contractsStore.votingToChangeKeys
      case 'votingToChangeMinThreshold':
        return contractsStore.votingToChangeMinThreshold
      case 'votingToChangeProxy':
        return contractsStore.votingToChangeProxy
      case 'votingToManageEmissionFunds':
        return contractsStore.votingToManageEmissionFunds
      case 'validatorMetadata':
        return contractsStore.validatorMetadata
      default:
        return contractsStore.votingToChangeKeys
    }
  }

  getMinBallotDuration(contractsStore, votingType) {
    switch (votingType) {
      case 'votingToChangeKeys':
        return contractsStore.minBallotDuration.keys
      case 'votingToChangeMinThreshold':
        return contractsStore.minBallotDuration.minThreshold
      case 'votingToChangeProxy':
        return contractsStore.minBallotDuration.proxy
      default:
        return 0
    }
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      this.calcTimeTo()
    }, 1000)
  }

  componentWillUnmount() {
    window.clearInterval(this.interval)
  }

  showCard = () => {
    let { commonStore } = this.props
    let checkToFinalizeFilter = commonStore.isToFinalizeFilter
      ? !this.isFinalized &&
        !this.isCanceled &&
        (this.timeToFinish.val === 0 || this.canBeFinalized) &&
        this.timeToStart.val === 0
      : true
    let show = commonStore.isActiveFilter ? !this.isFinalized && !this.isCanceled : checkToFinalizeFilter
    return show
  }

  typeName(type) {
    switch (type) {
      case 'votingToChangeMinThreshold':
        return 'Consensus'
      case 'votingToChangeKeys':
        return 'Keys'
      case 'votingToChangeProxy':
        return 'Proxy'
      case 'votingToManageEmissionFunds':
        return 'EmissionFunds'
      default:
        return ''
    }
  }

  getVotingNetworkBranch = () => {
    const { contractsStore } = this.props

    return contractsStore.netId ? getNetworkBranch(contractsStore.netId) : null
  }

  render() {
    let { votingType, children } = this.props
    let votes

    const networkBranch = this.getVotingNetworkBranch()

    if (votingType === 'votingToManageEmissionFunds') {
      votes = [
        {
          onClick: e => this.vote({ choice: BURN }),
          text: 'Burn',
          type: 'negative',
          votesAmount: this.votesBurnNumber,
          votesPercentage: this.votesBurnPercents
        },
        {
          onClick: e => this.vote({ choice: FREEZE }),
          text: 'Freeze',
          type: 'neutral',
          votesAmount: this.votesFreezeNumber,
          votesPercentage: this.votesFreezePercents
        },
        {
          onClick: e => this.vote({ choice: SEND }),
          text: 'Send',
          type: 'positive',
          votesAmount: this.votesSendNumber,
          votesPercentage: this.votesSendPercents
        }
      ]
    } else {
      votes = [
        {
          onClick: e => this.vote({ choice: REJECT }),
          text: 'No',
          type: 'negative',
          votesAmount: this.votesAgainstNumber,
          votesPercentage: this.votesAgainstPercents
        },
        {
          onClick: e => this.vote({ choice: ACCEPT }),
          side: 'right',
          text: 'Yes',
          type: 'positive',
          votesAmount: this.votesForNumber,
          votesPercentage: this.votesForPercents
        }
      ]
    }

    return (
      <div className={`sw-BallotCard ${!this.showCard() ? 'hidden' : ''}`}>
        <div className="sw-BallotAbout">
          <BallotDataPair dataType="name" title="Proposer" value={[this.creator]} />
          {children}
          <BallotDataPair
            dataType="time"
            title="Ballot Time (UTC)"
            value={[this.startTime, `${this.timeTo.displayValue} (${this.timeTo.title})`]}
          />
        </div>
        <Votes networkBranch={networkBranch} votes={votes} />
        <BallotInfoContainer memo={this.memo} networkBranch={networkBranch} threshold={this.minThreshold} />
        <BallotFooter
          buttonState={this.cancelOrFinalizeButtonState}
          buttonText={this.cancelOrFinalizeButtonDisplayName}
          description={this.cancelOrFinalizeDescription}
          networkBranch={networkBranch}
          onClick={e => this.cancelOrFinalize(e)}
          voteId={this.props.id}
          voteType={this.typeName(votingType)}
          voted={this.hasAlreadyVoted}
        />
      </div>
    )
  }
}
