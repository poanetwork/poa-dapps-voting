import React from 'react'
import Select from 'react-select'
import { FormInput } from '../FormInput'
import { FormSelect } from '../FormSelect'
import { inject, observer } from 'mobx-react'

@inject('ballotStore', 'contractsStore')
@observer
export class BallotProxyMetadata extends React.Component {
  render() {
    const { ballotStore, contractsStore, networkBranch } = this.props
    let options = [
      /*0*/ { value: '', label: '' },
      /*1*/ { value: '1', label: ballotStore.ProxyBallotType[1] }, // KeysManager
      /*2*/ { value: '2', label: ballotStore.ProxyBallotType[2] }, // VotingToChangeKeys
      /*3*/ { value: '3', label: ballotStore.ProxyBallotType[3] }, // VotingToChangeMinThreshold
      /*4*/ { value: '4', label: ballotStore.ProxyBallotType[4] }, // VotingToChangeProxy
      /*5*/ { value: '5', label: ballotStore.ProxyBallotType[5] }, // BallotsStorage
      /*6*/ { value: '7', label: ballotStore.ProxyBallotType[7] }, // ValidatorMetadata
      /*7*/ { value: '8', label: ballotStore.ProxyBallotType[8] } // ProxyStorage
    ]

    if (!contractsStore.proxyStorage || !contractsStore.proxyStorage.doesMethodExist('getValidatorMetadata')) {
      options.splice(6) // keep 0-5 and remove 6-... items if ProxyStorage is old
    }

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
