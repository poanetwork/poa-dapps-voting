import React from 'react';
import { inject, observer } from "mobx-react";

@inject("ballotStore")
@observer
export class KeysTypes extends React.Component {
  render() {
    const { ballotStore } = this.props;
    return (
      <div className="hidden">
        <div className="left">
          <div className="radio-container">
            <input type="radio" name="key-control" id="add-key"
              value={ballotStore.KeysBallotType.add}
              checked={ballotStore.isAddKeysBallotType}
              onChange={e => ballotStore.changeKeysBallotType(e, ballotStore.KeysBallotType.add)}
            />
            <label htmlFor="add-key" className="radio radio_icon radio_add">Add key</label>
            <p className="hint">
              Add new key.
            </p>
          </div>
          <div className="radio-container">
            <input type="radio" name="key-control" id="remove-key"
              value={ballotStore.KeysBallotType.remove}
              checked={ballotStore.isRemoveKeysBallotType}
              onChange={e => ballotStore.changeKeysBallotType(e, ballotStore.KeysBallotType.remove)}
            />
            <label htmlFor="remove-key" className="radio radio_icon radio_remove">Remove key</label>
            <p className="hint">
              Remove existing key.
            </p>
          </div>
          <div className="radio-container">
            <input type="radio" name="key-control" id="swap-key"
              value={ballotStore.KeysBallotType.swap}
              checked={ballotStore.isSwapKeysBallotType}
              onChange={e => ballotStore.changeKeysBallotType(e, ballotStore.KeysBallotType.swap)}
            />
            <label htmlFor="swap-key" className="radio radio_icon radio_swap">Swap key</label>
            <p className="hint">
              Remove existing key and add new key.
            </p>
          </div>
        </div>
        <div className="right">
          <div className="radio-container">
            <input type="radio" name="keys" id="mining-key"
              value={ballotStore.KeyType.mining}
              checked={ballotStore.isMiningKeyType}
              onChange={e => ballotStore.changeKeyType(e, ballotStore.KeyType.mining)}
            />
            <label htmlFor="mining-key" className="radio">Mining Key</label>
            <p className="hint">
              Mining key type.
            </p>
          </div>
          <div className="radio-container">
            <input type="radio" name="keys" id="payout-key"
              value={ballotStore.KeyType.payout}
              checked={ballotStore.isPayoutKeyType}
              onChange={e => ballotStore.changeKeyType(e, ballotStore.KeyType.payout)}
            />
            <label htmlFor="payout-key" className="radio">Payout Key</label>
            <p className="hint">
              Payout key type.
            </p>
          </div>
          <div className="radio-container">
            <input type="radio" name="keys" id="voting-key"
              value={ballotStore.KeyType.voting}
              checked={ballotStore.isVotingKeyType}
              onChange={e => ballotStore.changeKeyType(e, ballotStore.KeyType.voting)}
            />
            <label htmlFor="voting-key" className="radio">Voting Key</label>
            <p className="hint">
              Voting key type.
            </p>
          </div>
        </div>
      </div>
    );
  }
}
