import React from 'react';
import { inject, observer } from "mobx-react";
import Select from 'react-select';

@inject("ballotStore")
@observer
export class BallotProxyMetadata extends React.Component {
  render() {
    const { ballotStore } = this.props;
    return (
      <div>
        <div className="hidden">
          <div className="left">
            <div className="form-el">
              <label htmlFor="key">Proposed Address</label>
              <input type="text" id="key" 
                value={ballotStore.ballotProxy.proposedAddress} 
                onChange={e => ballotStore.changeBallotMetadata(e, "proposedAddress", "ballotProxy")} 
              />
              <p className="hint">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
              </p>
            </div>
          </div>
          <div className="right">
            <div className="form-el">
              <label htmlFor="us-state">Contract Type</label>
              <Select id="us-state"
                value={ballotStore.ballotProxy.contractType}
                onChange={e => ballotStore.changeBallotMetadata(e, "contractType", "ballotProxy")}
                options={[
                  { value: '', label: '' },
                  { value: '1', label: ballotStore.ProxyBallotType[1] },
                  { value: '2', label: ballotStore.ProxyBallotType[2] },
                  { value: '3', label: ballotStore.ProxyBallotType[3] },
                  { value: '4', label: ballotStore.ProxyBallotType[4] },
                  { value: '5', label: ballotStore.ProxyBallotType[5] },
                ]}
              >
              </Select>
              <p className="hint">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
              </p>
            </div>
          </div>
          <div className="left">
            <div className="form-el">
              <label htmlFor="key">Ballot End</label>
              <input type="date" id="key" 
                value={ballotStore.endTime} 
                onChange={e => ballotStore.changeBallotMetadata(e, "endTime")} 
              />
              <p className="hint">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
              </p>
            </div>
          </div>
        </div>
        <hr />
      </div>
    );
  }
}
