import React from 'react'
import { inject, observer } from 'mobx-react'
import { BallotCard } from './BallotCard.jsx'

@inject('commonStore', 'ballotStore', 'routing')
@observer
export class BallotProxyCard extends React.Component {
  render() {
    const { id, votingState, pos } = this.props
    return (
      <BallotCard votingType="votingToChangeProxy" votingState={votingState} id={id} pos={pos}>
        <div className="ballots-about-i ballots-about-i_contract-type">
          <div className="ballots-about-td ballots-about-td-title">
            <p className="ballots-about-i--title">Contract type</p>
          </div>
          <div className="ballots-about-td ballots-about-td-value">
            <p>{votingState.contractTypeDisplayName}</p>
          </div>
        </div>
        <div className="ballots-about-i ballots-about-i_proposed-address">
          <div className="ballots-about-td ballots-about-td-title">
            <p className="ballots-about-i--title">Proposed contract address</p>
          </div>
          <div className="ballots-about-td ballots-about-td-value">
            <p>{votingState.proposedValue}</p>
          </div>
        </div>
      </BallotCard>
    )
  }
}
