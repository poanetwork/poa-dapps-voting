import React from 'react'
import { inject, observer } from 'mobx-react'
import Select from 'react-select'

@inject('ballotStore', 'contractsStore')
@observer
export class BallotKeysMetadata extends React.Component {
  render() {
    const { ballotStore, contractsStore } = this.props
    let options = []
    for (var key in contractsStore.validatorsMetadata) {
      if (contractsStore.validatorsMetadata.hasOwnProperty(key)) {
        options.push(contractsStore.validatorsMetadata[key])
      }
    }
    let newVotingPayoutKeys = ''
    if (
      ballotStore.isNewValidatorPersonalData &&
      contractsStore.votingToChangeKeys &&
      contractsStore.votingToChangeKeys.doesMethodExist('createBallotToAddNewValidator')
    ) {
      newVotingPayoutKeys = (
        <div>
          <div className="left">
            <div className="form-el">
              <label htmlFor="new-voting-key">New Voting Key</label>
              <input
                type="text"
                id="new-voting-key"
                value={ballotStore.ballotKeys.newVotingKey}
                onChange={e => ballotStore.changeBallotMetadata(e, 'newVotingKey', 'ballotKeys')}
              />
              <p className="hint">
                Voting key address of new validator.<br />Example: 0xc70760D23557A4FDE612C0bE63b26EBD023C51Ee.
              </p>
            </div>
          </div>
          <div className="right">
            <div className="form-el">
              <label htmlFor="new-payout-key">New Payout Key</label>
              <input
                type="text"
                id="new-payout-key"
                value={ballotStore.ballotKeys.newPayoutKey}
                onChange={e => ballotStore.changeBallotMetadata(e, 'newPayoutKey', 'ballotKeys')}
              />
              <p className="hint">
                Payout key address of new validator.<br />Example: 0xc70760D23557A4FDE612C0bE63b26EBD023C51Ee.
              </p>
            </div>
          </div>
        </div>
      )
    }
    return (
      <div>
        <div>
          <div className="left">
            <div className="form-el">
              <label htmlFor="key">{ballotStore.isNewValidatorPersonalData ? 'New Mining Key' : 'Affected Key'}</label>
              <input
                type="text"
                id="key"
                value={ballotStore.ballotKeys.affectedKey}
                onChange={e => ballotStore.changeBallotMetadata(e, 'affectedKey', 'ballotKeys')}
              />
              <p className="hint">
                {ballotStore.isNewValidatorPersonalData
                  ? 'Mining key address of new validator.'
                  : 'Affected key address of validator to vote for.'}
                <br />Example: 0xc70760D23557A4FDE612C0bE63b26EBD023C51Ee.
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
                disabled={ballotStore.isNewValidatorPersonalData}
              />
              <p className="hint">
                Mining key address of validator to vote for.<br />Example: 0xc70760D23557A4FDE612C0bE63b26EBD023C51Ee.
              </p>
            </div>
          </div>
          <div className="clearfix"> </div>
          {newVotingPayoutKeys}
          <div className="left">
            <div className="form-el">
              <label htmlFor="datetime-local">Ballot End</label>
              <input
                type="datetime-local"
                id="datetime-local"
                value={ballotStore.endTime}
                min={ballotStore.endTime}
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
