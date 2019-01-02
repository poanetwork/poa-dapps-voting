import React from 'react'
import { inject, observer } from 'mobx-react'
import Select from 'react-select'

@inject('ballotStore', 'contractsStore')
@observer
export class BallotProxyMetadata extends React.Component {
  render() {
    const { ballotStore, contractsStore } = this.props
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
      <div>
        <div>
          <div className="left">
            <div className="form-el">
              <label htmlFor="key">Proposed Address</label>
              <input
                type="text"
                id="key"
                value={ballotStore.ballotProxy.proposedAddress}
                onChange={e => ballotStore.changeBallotMetadata(e, 'proposedAddress', 'ballotProxy')}
              />
              <p className="hint">Proposed address of a new proxy contract.</p>
            </div>
          </div>
          <div className="right">
            <div className="form-el">
              <label htmlFor="contract-type">Contract Type</label>
              <Select
                id="contract-type"
                value={ballotStore.ballotProxy.contractType}
                onChange={e => ballotStore.changeBallotMetadata(e, 'contractType', 'ballotProxy')}
                options={options}
              />
              <p className="hint">Choose proxy contract type.</p>
            </div>
          </div>
          <div className="left">
            <div className="form-el">
              <label htmlFor="datetime-local">Ballot End</label>
              <input
                type="datetime-local"
                id="datetime-local"
                value={ballotStore.endTime}
                onChange={e => ballotStore.changeBallotMetadata(e, 'endTime')}
              />
              <p className="hint">Ballot's end time.</p>
            </div>
          </div>
        </div>
        <hr />
      </div>
    )
  }
}
