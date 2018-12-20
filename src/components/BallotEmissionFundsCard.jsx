import React from 'react'
import { inject, observer } from 'mobx-react'
import { BallotCard } from './BallotCard'

@inject('contractsStore')
@observer
export class BallotEmissionFundsCard extends React.Component {
  render() {
    const { id, votingState, pos, contractsStore } = this.props
    const amount = contractsStore.web3Instance.utils.fromWei(votingState.amount, 'ether')
    return (
      <BallotCard votingType="votingToManageEmissionFunds" votingState={votingState} id={id} pos={pos}>
        <div className="sw-BallotAbout-i sw-BallotAbout-i_proposed_receiver">
          <div className="ballots-about-td ballots-about-td-title">
            <p className="sw-BallotAbout-i--title">Proposed Receiver</p>
          </div>
          <div className="ballots-about-td ballots-about-td-value">
            <p>{votingState.receiver}</p>
          </div>
        </div>
        <div className="sw-BallotAbout-i sw-BallotAbout-i_funds_amount">
          <div className="ballots-about-td ballots-about-td-title">
            <p className="sw-BallotAbout-i--title">Funds Amount</p>
          </div>
          <div className="ballots-about-td ballots-about-td-value">
            <p>{amount} POA</p>
          </div>
        </div>
      </BallotCard>
    )
  }
}
