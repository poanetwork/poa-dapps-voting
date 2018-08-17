import React from 'react'
import { inject, observer } from 'mobx-react'

@inject('ballotStore')
@observer
export class KeysTypes extends React.Component {
  render() {
    const { ballotStore } = this.props
    return (
      <div className="hidden">
        <div className="keys-radio-button-tr">
          <div className="keys-radio-button-td">
            <div className="radio-button">
              <input
                type="radio"
                name="key-control"
                id="add-key"
                value={ballotStore.KeysBallotType.add}
                checked={ballotStore.isAddKeysBallotType}
                onChange={e => ballotStore.changeKeysBallotType(e, ballotStore.KeysBallotType.add)}
              />
              <label className="radio-button-label" htmlFor="add-key">
                Add key
              </label>
            </div>
            <p className="hint">Add new key.</p>
          </div>
          <div className="keys-radio-button-td">
            <div className="radio-button">
              <input
                type="radio"
                name="key-control"
                id="remove-key"
                value={ballotStore.KeysBallotType.remove}
                checked={ballotStore.isRemoveKeysBallotType}
                onChange={e => ballotStore.changeKeysBallotType(e, ballotStore.KeysBallotType.remove)}
              />
              <label className="radio-button-label" htmlFor="remove-key">
                Remove key
              </label>
            </div>
            <p className="hint">Remove existing key.</p>
          </div>
          <div className="keys-radio-button-td">
            <div className="radio-button">
              <input
                type="radio"
                name="key-control"
                id="swap-key"
                value={ballotStore.KeysBallotType.swap}
                checked={ballotStore.isSwapKeysBallotType}
                onChange={e => ballotStore.changeKeysBallotType(e, ballotStore.KeysBallotType.swap)}
              />
              <label className="radio-button-label" htmlFor="swap-key">
                Swap key
              </label>
            </div>
            <p className="hint">Remove existing key and add new key.</p>
          </div>
        </div>
        <div className="keys-radio-button-tr">
          <div className="keys-radio-button-td">
            <div className="radio-button">
              <input
                type="radio"
                name="keys"
                id="mining-key"
                value={ballotStore.KeyType.mining}
                checked={ballotStore.isMiningKeyType}
                onChange={e => ballotStore.changeKeyType(e, ballotStore.KeyType.mining)}
              />
              <label className="radio-button-label" htmlFor="mining-key">
                Mining Key
              </label>
            </div>
            <p className="hint">Mining key type.</p>
          </div>
          <div className="keys-radio-button-td">
            <div className="radio-button">
              <input
                type="radio"
                name="keys"
                id="payout-key"
                value={ballotStore.KeyType.payout}
                checked={ballotStore.isPayoutKeyType}
                onChange={e => ballotStore.changeKeyType(e, ballotStore.KeyType.payout)}
              />
              <label className="radio-button-label" htmlFor="payout-key">
                Payout Key
              </label>
            </div>
            <p className="hint">Payout key type.</p>
          </div>
          <div className="keys-radio-button-td">
            <div className="radio-button">
              <input
                type="radio"
                name="keys"
                id="voting-key"
                value={ballotStore.KeyType.voting}
                checked={ballotStore.isVotingKeyType}
                onChange={e => ballotStore.changeKeyType(e, ballotStore.KeyType.voting)}
              />
              <label className="radio-button-label" htmlFor="voting-key">
                Voting Key
              </label>
            </div>
            <p className="hint">Voting key type.</p>
          </div>
        </div>
      </div>
    )
  }
}
