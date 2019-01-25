import React from 'react'
import { FormInput } from '../FormInput'
import { FormSelect } from '../FormSelect'
import { inject, observer } from 'mobx-react'

@inject('ballotStore', 'contractsStore')
@observer
export class BallotProxyMetadata extends React.Component {
  render() {
    const { ballotStore, networkBranch } = this.props
    let options = [
      { value: '', label: '' },
      { value: '1', label: ballotStore.ProxyBallotType[1] }, // KeysManager
      { value: '2', label: ballotStore.ProxyBallotType[2] }, // VotingToChangeKeys
      { value: '3', label: ballotStore.ProxyBallotType[3] }, // VotingToChangeMinThreshold
      { value: '4', label: ballotStore.ProxyBallotType[4] }, // VotingToChangeProxy
      { value: '5', label: ballotStore.ProxyBallotType[5] }, // BallotsStorage
      { value: '7', label: ballotStore.ProxyBallotType[7] }, // ValidatorMetadata
      { value: '8', label: ballotStore.ProxyBallotType[8] }, // ProxyStorage
      { value: '9', label: ballotStore.ProxyBallotType[9] } // RewardByBlock
    ]

    return (
      <div className="frm-BallotProxyMetadata">
        <div className="frm-BallotProxyMetadata_Row">
          <FormInput
            hint="Proposed address of a new proxy contract."
            id="key"
            networkBranch={networkBranch}
            onChange={e => ballotStore.changeBallotMetadata(e, 'proposedAddress', 'ballotProxy')}
            title="Proposed Address"
            value={ballotStore.ballotProxy.proposedAddress}
          />
          <FormSelect
            hint="Choose proxy contract type."
            id="contract-type"
            networkBranch={networkBranch}
            onChange={e => ballotStore.changeBallotMetadata(e, 'contractType', 'ballotProxy')}
            options={options}
            title="Contract Type"
            value={ballotStore.ballotProxy.contractType}
          />
        </div>
        <div className="frm-BallotProxyMetadata_Row">
          <FormInput
            hint="Ballot's end time."
            id="datetime-local"
            networkBranch={networkBranch}
            onChange={e => ballotStore.changeBallotMetadata(e, 'endTime')}
            title="Ballot End"
            type="datetime-local"
            value={ballotStore.endTime}
          />
        </div>
      </div>
    )
  }
}
