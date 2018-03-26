import React from "react";
import { inject, observer } from "mobx-react";
import Select from "react-select";
import "react-select/dist/react-select.css";

@inject("ballotStore", "contractsStore")
@observer
export class BallotKeysMetadata extends React.Component {
  render() {
    const options = this.props.contractsStore.validatorsMetadata.slice();
    const { ballotStore } = this.props;
    return (
      <div>
        <div className="hidden">
          <div className="left">
            <div className="form-el">
              <label htmlFor="key">Affected Key</label>
              <input type="text" id="key"
                value={ballotStore.ballotKeys.affectedKey}
                onChange={e => ballotStore.changeBallotMetadata(e, "affectedKey", "ballotKeys")}
              />
              <p className="hint">
                Affected key address of validator to vote for. Example: 0xc70760D23557A4FDE612C0bE63b26EBD023C51Ee.
              </p>
            </div>
          </div>
          <div className="right">
            <div className="form-el">
              <label htmlFor="mining-key">Mining Key</label>
              <Select.Creatable
                name="form-field-name"
                id="mining-key"
                value={ballotStore.ballotKeys.miningKey}
                onChange={ballotStore.setMiningKey}
                options={options}
              />
              <p className="hint">
                Mining key address of validator to vote for. Example: 0xc70760D23557A4FDE612C0bE63b26EBD023C51Ee.
              </p>
            </div>
          </div>
          <div className="left">
            <div className="form-el">
              <label htmlFor="datetime-local">Ballot End</label>
              <input type="datetime-local" id="datetime-local"
                value={ballotStore.endTime}
                min={ballotStore.endTime}
                onChange={e => ballotStore.changeBallotMetadata(e, "endTime")}
              />
              <p className="hint">
                Ballot's end time.
              </p>
            </div>
          </div>
        </div>
        <hr />
      </div>
    );
  }
}
