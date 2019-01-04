import React from 'react'
import { FormInput } from '../FormInput'
import { inject, observer } from 'mobx-react'

@inject('ballotStore')
@observer
export class BallotMinThresholdMetadata extends React.Component {
  render() {
    const { ballotStore, networkBranch } = this.props

    return (
      <div className="frm-BallotMinThresholdMetadata">
        <div className="frm-BallotMinThresholdMetadata_Row">
          <FormInput
            hint="Proposed value of the minimum threshold for keys ballot consensus."
            id="key"
            networkBranch={networkBranch}
            onChange={e => ballotStore.changeBallotMetadata(e, 'proposedValue', 'ballotMinThreshold')}
            title="Proposed Value"
            type="number"
            value={ballotStore.ballotMinThreshold.proposedValue}
          />
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
