import React from 'react'
import { inject, observer } from 'mobx-react'

@inject('ballotStore')
@observer
export class BallotMinThresholdMetadata extends React.Component {
  render() {
    const { ballotStore } = this.props
    return (
      <div>
        <div className="hidden">
          <div className="left">
            <div className="form-el">
              <label htmlFor="key">Proposed Value</label>
              <input
                type="number"
                id="key"
                value={ballotStore.ballotMinThreshold.proposedValue}
                onChange={e => ballotStore.changeBallotMetadata(e, 'proposedValue', 'ballotMinThreshold')}
              />
              <p className="hint">Proposed value of the minimum threshold for keys ballot consensus.</p>
            </div>
          </div>
          <div className="right">
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
