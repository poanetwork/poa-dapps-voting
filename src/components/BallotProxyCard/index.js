import React from 'react'
import { BallotCard } from '../BallotCard'
import { BallotDataPair } from '../BallotDataPair'
import { inject, observer } from 'mobx-react'

@inject('commonStore', 'ballotStore', 'routing')
@observer
export class BallotProxyCard extends React.Component {
  render() {
    const { id, votingState, pos } = this.props
    return (
      <BallotCard votingType="votingToChangeProxy" votingState={votingState} id={id} pos={pos}>
        <BallotDataPair dataType="contract-type" title="Contract type" value={[votingState.contractTypeDisplayName]} />
        <BallotDataPair
          dataType="proposed-address"
          title="Proposed contract address"
          value={[votingState.proposedValue]}
        />
      </BallotCard>
    )
  }
}
