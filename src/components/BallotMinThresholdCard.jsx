import React from 'react'
import { inject, observer } from 'mobx-react'
import { BallotCard } from './BallotCard.jsx'

@inject('commonStore', 'routing')
@observer
export class BallotMinThresholdCard extends React.Component {
  render() {
    let { id, votingState, pos } = this.props
    return (
      <BallotCard votingType="votingToChangeMinThreshold" votingState={votingState} id={id} pos={pos}>
        <div className="ballots-about-i ballots-about-i_proposed-min-threshold">
          <div className="ballots-about-td ballots-about-td-title">
            <p className="ballots-about-i--title">Proposed min threshold</p>
          </div>
          <div className="ballots-about-td ballots-about-td-value">
            <p>{votingState.proposedValue}</p>
          </div>
        </div>
      </BallotCard>
    )
  }
}
