import React from 'react'
import { FormInput } from '../FormInput'
import { FormSelect } from '../FormSelect'
import { Separator } from '../Separator'
import { inject, observer } from 'mobx-react'

@inject('ballotStore', 'contractsStore')
@observer
export class BallotKeysMetadata extends React.Component {
  render() {
    const { ballotStore, contractsStore, networkBranch } = this.props
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
                Voting key address of new validator.
                <br />
                Example: 0xc70760D23557A4FDE612C0bE63b26EBD023C51Ee.
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
                Payout key address of new validator.
                <br />
                Example: 0xc70760D23557A4FDE612C0bE63b26EBD023C51Ee.
              </p>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="frm-BallotKeysMetadata">
        <div className="frm-BallotKeysMetadata_Row">
          <FormInput
            id="key"
            networkBranch={networkBranch}
            onChange={e => ballotStore.changeBallotMetadata(e, 'affectedKey', 'ballotKeys')}
            title={ballotStore.isNewValidatorPersonalData ? 'New Mining Key' : 'Affected Key'}
            value={ballotStore.ballotKeys.affectedKey}
            hint={`${
              ballotStore.isNewValidatorPersonalData
                ? 'Mining key address of new validator.'
                : 'Affected key address of validator to vote for.'
            }
            <br>Example: 0xc70760D23557A4FDE612C0bE63b26EBD023C51Ee.`}
          />
          <FormSelect
            disabled={ballotStore.isNewValidatorPersonalData}
            hint="Mining key address of validator to vote for.<br />Example: 0xc70760D23557A4FDE612C0bE63b26EBD023C51Ee."
            id="mining-key"
            name="form-field-name"
            networkBranch={networkBranch}
            onChange={ballotStore.setMiningKey}
            options={options}
            title="Mining Key"
            value={ballotStore.ballotKeys.miningKey}
          />
        </div>
        <div className="clearfix"> </div>
        {newVotingPayoutKeys}
        <div className="frm-BallotKeysMetadata_Row">
          <FormInput
            hint="Ballot's end time."
            id="datetime-local"
            min={ballotStore.endTime}
            networkBranch={networkBranch}
            onChange={e => ballotStore.changeBallotMetadata(e, 'endTime')}
            title="Ballot End"
            type="datetime-local"
            value={ballotStore.endTime}
          />
        </div>
        <Separator />
      </div>
    )
  }
}
