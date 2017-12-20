import React from 'react';
import { inject, observer } from "mobx-react";

@inject("ballotStore")
@observer
export class BallotKeysMetadata extends React.Component {
  render() {
    const { ballotStore } = this.props;
    return (
      <div>
        <div className="hidden">
          <div className="left">
            <div className="form-el">
              <label for="key">Affected Key</label>
              <input type="text" id="key" 
                value={ballotStore.affectedKey} 
                onChange={e => ballotStore.changeBallotMetadata(e, "affectedKey", "ballotKeys")} 
              />
              <p className="hint">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
              </p>
            </div>
          </div>
          <div className="right">
            <div className="form-el">
              <label for="key">Mining Key</label>
              <input type="text" id="key" 
                value={ballotStore.miningKey} 
                onChange={e => ballotStore.changeBallotMetadata(e, "miningKey", "ballotKeys")} 
              />
              <p className="hint">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
              </p>
            </div>
          </div>
          <div className="left">
            <div className="form-el">
              <label for="memo">Memo</label>
              <input type="text" id="memo" 
                value={ballotStore.memo} 
                onChange={e => ballotStore.changeBallotMetadata(e, "memo", "ballotKeys")} 
              />
              <p className="hint">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
              </p>
            </div>
          </div>
          <div className="right">
            <div className="form-el">
              <label for="key">Ballot End</label>
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
