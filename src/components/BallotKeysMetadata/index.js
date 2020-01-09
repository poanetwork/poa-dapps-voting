import React from 'react'
import { FormInput } from '../FormInput'
import { FormSelect } from '../FormSelect'
import { inject, observer } from 'mobx-react'

@inject('ballotStore', 'contractsStore')
@observer
export class BallotKeysMetadata extends React.Component {
  showNewVotingPayoutKeys() {
    const { ballotStore, contractsStore } = this.props

    return (
      ballotStore.isNewValidatorPersonalData &&
      contractsStore.votingToChangeKeys &&
      contractsStore.votingToChangeKeys.doesMethodExist('createBallotToAddNewValidator')
    )
  }

  render() {
    const { ballotStore, contractsStore, networkBranch } = this.props
    let options = []

    for (var key in contractsStore.validatorsMetadata) {
      if (contractsStore.validatorsMetadata.hasOwnProperty(key)) {
        options.push(contractsStore.validatorsMetadata[key])
      }
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
            id="mining-key-select"
            name="form-field-name"
            networkBranch={networkBranch}
            onChange={ballotStore.setMiningKey}
            options={options}
            title="Mining Key"
            value={ballotStore.ballotKeys.miningKey}
          />
        </div>
        {this.showNewVotingPayoutKeys() ? (
          <div className="frm-BallotKeysMetadata_Row">
            <FormInput
              hint="Voting key address of new validator.<br />Example: 0xc70760D23557A4FDE612C0bE63b26EBD023C51Ee."
              id="new-voting-key"
              networkBranch={networkBranch}
              onChange={e => ballotStore.changeBallotMetadata(e, 'newVotingKey', 'ballotKeys')}
              title="New Voting Key"
              value={ballotStore.ballotKeys.newVotingKey}
            />
            <FormInput
              hint="Payout key address of new validator.<br />Example: 0xc70760D23557A4FDE612C0bE63b26EBD023C51Ee."
              id="new-payout-key"
              networkBranch={networkBranch}
              onChange={e => ballotStore.changeBallotMetadata(e, 'newPayoutKey', 'ballotKeys')}
              title="New Payout Key"
              value={ballotStore.ballotKeys.newPayoutKey}
            />
          </div>
        ) : null}
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
      </div>
    )
  }
}
