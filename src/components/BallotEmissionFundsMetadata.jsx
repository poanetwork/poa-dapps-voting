import React from 'react'
import { observable, action } from 'mobx'
import { inject, observer } from 'mobx-react'
import { constants } from '../constants'
import moment from 'moment'

@inject('ballotStore', 'contractsStore')
@observer
export class BallotEmissionFundsMetadata extends React.Component {
  @observable emissionFundsBalance = 'Loading...'
  @observable noActiveBallotExists
  @observable beginDateTime
  @observable endDateTime

  @action('Get EmissionFunds balance')
  getEmissionFundsBalance = async () => {
    const { contractsStore } = this.props
    this.emissionFundsBalance =
      contractsStore.web3Instance.utils.fromWei(await contractsStore.emissionFunds.balance(), 'ether') + ' POA'
  }

  @action('Get VotingToManageEmissionFunds.noActiveBallotExists')
  getNoActiveBallotExists = async () => {
    this.noActiveBallotExists = await this.props.contractsStore.votingToManageEmissionFunds.noActiveBallotExists()
  }

  @action('Get beginDateTime and endDateTime')
  getDateTimeLimits = async () => {
    const { votingToManageEmissionFunds } = this.props.contractsStore
    const dateTimeFormat = 'MM/DD/YYYY h:mm A'

    this.beginDateTime = '...loading date...'
    this.endDateTime = '...loading date...'

    let emissionReleaseTime = Number(await votingToManageEmissionFunds.emissionReleaseTime())
    const emissionReleaseThreshold = Number(await votingToManageEmissionFunds.emissionReleaseThreshold())
    const currentTime = Number(await votingToManageEmissionFunds.getTime())
    const distributionThreshold = Number(await votingToManageEmissionFunds.distributionThreshold())
    emissionReleaseTime = votingToManageEmissionFunds.refreshEmissionReleaseTime(
      emissionReleaseTime,
      emissionReleaseThreshold,
      currentTime
    )

    const releasePlusDistribution = emissionReleaseTime + distributionThreshold

    if (currentTime < releasePlusDistribution) {
      this.beginDateTime = moment.unix(emissionReleaseTime).format(dateTimeFormat)
      this.endDateTime = moment.unix(releasePlusDistribution).format(dateTimeFormat)
    } else {
      const futureEmissionReleaseTime = emissionReleaseTime + emissionReleaseThreshold
      this.beginDateTime = moment.unix(futureEmissionReleaseTime).format(dateTimeFormat)
      this.endDateTime = moment.unix(futureEmissionReleaseTime + distributionThreshold).format(dateTimeFormat)
    }
  }

  constructor(props) {
    super(props)
    this.getEmissionFundsBalance()
    this.getNoActiveBallotExists()
    this.getDateTimeLimits()
  }

  componentDidMount() {
    this.interval = setInterval(this.getEmissionFundsBalance, constants.getTransactionReceiptInterval)
  }

  componentWillUnmount() {
    window.clearInterval(this.interval)
  }

  render() {
    const { ballotStore, contractsStore } = this.props
    let note, explorerLink
    if (this.noActiveBallotExists === true) {
      note = (
        <p>
          The ballot can be created starting from <b>{this.beginDateTime}</b> (local time) and will end on{' '}
          <b>{this.endDateTime}</b> (local time).
        </p>
      )
    } else if (this.noActiveBallotExists !== true) {
      note = <p>To be able to create a new ballot, the previous ballot of this type must be finalized.</p>
    }
    if (constants.NETWORKS[contractsStore.netId].NAME.toLowerCase() === 'sokol') {
      explorerLink = `https://sokol.poaexplorer.com/address/search/${contractsStore.emissionFunds.address}`
    } else {
      explorerLink = `https://poaexplorer.com/address/${contractsStore.emissionFunds.address}`
    }
    return (
      <div>
        <div className="hidden">
          <div className="left">
            <div className="form-el">
              <label htmlFor="receiver">Address of funds receiver</label>
              <input
                type="text"
                id="receiver"
                value={ballotStore.ballotEmissionFunds.receiver}
                onChange={e => ballotStore.changeBallotMetadata(e, 'receiver', 'ballotEmissionFunds')}
              />
              <p className="hint">The address which the funds will be sent to, in case of the majority of votes.</p>
            </div>
          </div>
          <div className="right">
            <div className="form-el">
              <label htmlFor="amount">Current amount of funds</label>
              <input type="text" id="amount" value={this.emissionFundsBalance} disabled="disabled" />
              <p className="hint">
                Current balance of&nbsp;
                <a href={explorerLink} target="_blank">
                  EmissionFunds contract
                </a>.
              </p>
            </div>
          </div>
        </div>
        <hr />
        {note}
        <br />
      </div>
    )
  }
}
