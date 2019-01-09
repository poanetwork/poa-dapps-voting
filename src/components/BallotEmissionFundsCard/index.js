import React from 'react'
import { BallotCard } from '../BallotCard'
import { BallotDataPair } from '../BallotDataPair'
import { inject, observer } from 'mobx-react'

@inject('contractsStore')
@observer
export class BallotEmissionFundsCard extends React.Component {
  render() {
    const { id, votingState, pos, contractsStore } = this.props
    const amount = contractsStore.web3Instance.utils.fromWei(votingState.amount, 'ether')
    return (
      <BallotCard votingType="votingToManageEmissionFunds" votingState={votingState} id={id} pos={pos}>
        <BallotDataPair dataType="proposed-receiver" title="Proposed Receiver" value={[votingState.receiver]} />
        <BallotDataPair dataType="funds-amount" title="Funds Amount" value={[`${amount} POA`]} />
      </BallotCard>
    )
  }
}
