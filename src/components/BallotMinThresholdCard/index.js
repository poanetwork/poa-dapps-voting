import React from 'react'
import { BallotCard } from '../BallotCard'
import { BallotDataPair } from '../BallotDataPair'
import { inject, observer } from 'mobx-react'

@inject('commonStore', 'routing')
@observer
export class BallotMinThresholdCard extends React.Component {
  render() {
    let { id, votingState, pos } = this.props
    return (
      <BallotCard votingType="votingToChangeMinThreshold" votingState={votingState} id={id} pos={pos}>
        <BallotDataPair
          dataType="proposed-min-threshold"
          title="Proposed min threshold"
          value={[votingState.proposedValue]}
        />
      </BallotCard>
    )
  }
}
