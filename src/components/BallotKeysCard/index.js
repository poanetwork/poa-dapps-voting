import React from 'react'
import { BallotCard } from '../BallotCard'
import { BallotDataPair } from '../BallotDataPair'
import { inject, observer } from 'mobx-react'

@inject('commonStore', 'routing')
@observer
export class BallotKeysCard extends React.Component {
  render() {
    let { id, votingState, pos } = this.props
    let affectedKey = votingState.affectedKey
    let newVotingKey
    let newPayoutKey
    let affectedKeyType = 'key'

    if (votingState.isAddMining) {
      affectedKeyType = 'key-wide'
      if (votingState.newVotingKey || votingState.newPayoutKey) {
        affectedKey = `Mining: ${votingState.affectedKey}`
        if (votingState.newVotingKey) newVotingKey = `Voting: ${votingState.newVotingKey}`
        if (votingState.newPayoutKey) newPayoutKey = `Payout: ${votingState.newPayoutKey}`
      }
    }

    return (
      <BallotCard votingType="votingToChangeKeys" votingState={votingState} id={id} pos={pos}>
        <BallotDataPair dataType="action" title="Action" value={[votingState.ballotTypeDisplayName]} />
        <BallotDataPair dataType="type" title="Key type" value={[votingState.affectedKeyTypeDisplayName]} />
        <BallotDataPair
          dataType={affectedKeyType}
          title="Affected key"
          value={[affectedKey, newVotingKey, newPayoutKey]}
        />
        {!votingState.isAddMining ? (
          <BallotDataPair dataType="key" title="Validator key" value={[votingState.miningKey]} />
        ) : null}
      </BallotCard>
    )
  }
}
