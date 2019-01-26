import React from 'react'
import moment from 'moment'
import { FormInput } from '../FormInput'
import { constants } from '../../utils/constants'
import { inject, observer } from 'mobx-react'
import { observable, action } from 'mobx'

@inject('ballotStore', 'contractsStore')
@observer
export class BallotEmissionFundsMetadata extends React.Component {
  @observable emissionFundsBalance = 'Loading...'
  @observable noActiveBallotExists
  @observable beginDateTime
  @observable endDateTime

  constructor(props) {
    super(props)
    this.getEmissionFundsBalance()
    this.getNoActiveBallotExists()
    this.getDateTimeLimits()
  }

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

  componentDidMount() {
    this.interval = setInterval(this.getEmissionFundsBalance, constants.getTransactionReceiptInterval)
  }

  componentWillUnmount() {
    window.clearInterval(this.interval)
  }

  render() {
    const { ballotStore, contractsStore, networkBranch } = this.props
    let note

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

    const networkName = constants.NETWORKS[contractsStore.netId].NAME.toLowerCase()
    const explorerLink = `https://blockscout.com/poa/${networkName}/address/${contractsStore.emissionFunds.address}`

    return (
      <div className="frm-BallotEmissionFundsMetadata">
        <div className="frm-BallotEmissionFundsMetadata_Row">
          <FormInput
            hint="The address which the funds will be sent to, in case of the majority of votes."
            id="receiver"
            networkBranch={networkBranch}
            onChange={e => ballotStore.changeBallotMetadata(e, 'receiver', 'ballotEmissionFunds')}
            title="Address of funds receiver"
            value={ballotStore.ballotEmissionFunds.receiver}
          />
          <FormInput
            disabled={true}
            hint={`Current balance of <a href=${explorerLink} target="_blank">EmissionFunds contract</a>.`}
            id="amount"
            networkBranch={networkBranch}
            onChange={e => ballotStore.changeBallotMetadata(e, 'receiver', 'ballotEmissionFunds')}
            title="Current amount of funds"
            value={this.emissionFundsBalance}
          />
        </div>
        {note}
      </div>
    )
  }
}
