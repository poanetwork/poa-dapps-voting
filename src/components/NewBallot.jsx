import React from 'react';
import { inject, observer } from "mobx-react";
import Select from 'react-select';

@inject("ballotStore", "validatorStore", "contractsStore")
@observer
export class NewBallot extends React.Component {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    const { contractsStore, ballotStore } = this.props;
    const curDate = new Date();
    const curDateInSeconds = curDate.getSeconds()/1000;
    contractsStore.votingToChangeKeys.votingToChangeKeysInstance.methods.createVotingForKeys(
      curDateInSeconds,
      curDateInSeconds,
      ballotStore.affectedKey, 
      ballotStore.keyType, 
      ballotStore.miningKey,
      ballotStore.ballotType  
    )
    .send({from: contractsStore.votingKey});
  }

  render() {
    const { ballotStore, validatorStore } = this.props;
    return (
      <section className="container new">
        <h1 className="title">New Ballot</h1>
        <form action="" className="new-form">
          <div className="hidden">
            <div className="left">
              <div className="radio-container">
                <input type="radio" name="ballot-type" id="ballot-for-validators" 
                  value={ballotStore.BallotType.keys}
                  checked={ballotStore.isBallotForKey} 
                  onChange={e => ballotStore.changeBallotType(e, ballotStore.BallotType.keys)}
                />
                <label for="ballot-for-validators" className="radio">Ballot for validators</label>
                <p className="hint">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                  eiusmod tempor incididunt ut labore
                </p>
              </div>
            </div>
            <div className="right">
              <div className="radio-container">
                <input type="radio" name="ballot-type" id="ballot-for-consensus" 
                  value={ballotStore.BallotType.minThreshold}
                  checked={ballotStore.isBallotForMinThreshold} 
                  onChange={e => ballotStore.changeBallotType(e, ballotStore.BallotType.minThreshold)}
                />
                <label for="ballot-for-consensus" className="radio">Ballot for consensus</label>
                <p className="hint">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                  eiusmod tempor incididunt ut labore
                </p>
              </div>
            </div>
          </div>
          <hr />
          <div className="hidden">
            <div className="left">
              <div className="form-el">
                <label for="full-name">Full Name</label>
                <input type="text" id="full-name" 
                  value={validatorStore.fullName} 
                  onChange={e => validatorStore.changeValidatorMetadata(e, "fullName")}
                />
                <p className="hint">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                </p>
              </div>
            </div>
            <div className="right">
              <div className="form-el">
                <label for="address">Address</label>
                <input type="text" id="address" 
                  value={validatorStore.address} 
                  onChange={e => validatorStore.changeValidatorMetadata(e, "address")}
                />
                <p className="hint">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                </p>
              </div>
            </div>
            <div className="left">
              <div className="form-el">
                <label for="us-state">State</label>
                <Select id="us-state"
                  value={validatorStore.state}
                  onChange={e => validatorStore.changeValidatorMetadata(e, "state")}
                  options={[
                    { value: '', label: '' },
                    { value: 'Alabama', label: 'Alabama' },
                    { value: 'Florida', label: 'Florida' },
                  ]}
                >
                </Select>
                <p className="hint">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                </p>
              </div>
            </div>
            <div className="right">
              <div className="form-el">
                <label for="zip-code">Zip Code</label>
                <input type="number" id="zip-code" 
                  value={validatorStore.zipCode} 
                  onChange={e => validatorStore.changeValidatorMetadata(e, "zipCode")}
                />
                <p className="hint">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                </p>
              </div>
            </div>
            <div className="left">
              <div className="form-el">
                <label for="license-id">License ID</label>
                <input type="text" id="license-id" 
                  value={validatorStore.licenseID} 
                  onChange={e => validatorStore.changeValidatorMetadata(e, "licenseID")}
                />
                <p className="hint">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                </p>
              </div>
            </div>
            <div className="right">
              <div className="form-el">
                <label for="license-expiration">License Expiration</label>
                <input type="date" id="license-expiration" 
                  value={validatorStore.licenseExpiration} 
                  onChange={e => validatorStore.changeValidatorMetadata(e, "licenseExpiration")}
                />
                <p className="hint">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                </p>
              </div>
            </div>
          </div>
          <hr />
          <div className="hidden">
            <div className="left">
              <div className="radio-container">
                <input type="radio" name="key-control" id="add-key" 
                  value={ballotStore.KeysBallotType.add}
                  checked={ballotStore.isAddKeysBallotType} 
                  onChange={e => ballotStore.changeKeysBallotType(e, ballotStore.KeysBallotType.add)}
                />
                <label for="add-key" className="radio radio_icon radio_add">Add key</label>
                <p className="hint">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                </p>
              </div>
              <div className="radio-container">
                <input type="radio" name="key-control" id="remove-key" 
                  value={ballotStore.KeysBallotType.remove}
                  checked={ballotStore.isRemoveKeysBallotType} 
                  onChange={e => ballotStore.changeKeysBallotType(e, ballotStore.KeysBallotType.remove)}
                />
                <label for="remove-key" className="radio radio_icon radio_remove">Remove key</label>
                <p className="hint">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                </p>
              </div>
              <div className="radio-container">
                <input type="radio" name="key-control" id="swap-key" 
                  value={ballotStore.KeysBallotType.swap}
                  checked={ballotStore.isSwapKeysBallotType} 
                  onChange={e => ballotStore.changeKeysBallotType(e, ballotStore.KeysBallotType.swap)}
                />
                <label for="swap-key" className="radio radio_icon radio_swap">Swap key</label>
                <p className="hint">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
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
                <label for="mining-key" className="radio">Mining Key</label>
                <p className="hint">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                </p>
              </div>
              <div className="radio-container">
                <input type="radio" name="keys" id="payout-key" 
                  value={ballotStore.KeyType.payout}
                  checked={ballotStore.isPayoutKeyType} 
                  onChange={e => ballotStore.changeKeyType(e, ballotStore.KeyType.payout)}
                />
                <label for="payout-key" className="radio">Payout Key</label>
                <p className="hint">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                </p>
              </div>
              <div className="radio-container">
                <input type="radio" name="keys" id="voting-key" 
                  value={ballotStore.KeyType.voting}
                  checked={ballotStore.isVotingKeyType} 
                  onChange={e => ballotStore.changeKeyType(e, ballotStore.KeyType.voting)}
                />
                <label for="voting-key" className="radio">Voting Key</label>
                <p className="hint">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                </p>
              </div>
            </div>
          </div>
          <div className="hidden">
            <div className="left">
              <div className="form-el">
                <label for="memo">Memo</label>
                <input type="text" id="memo" 
                  value={ballotStore.memo} 
                  onChange={e => ballotStore.changeBallotMetadata(e, "memo")} 
                />
                <p className="hint">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                </p>
              </div>
            </div>
            <div className="right">
              <div className="form-el">
                <label for="key">Affected Key</label>
                <input type="text" id="key" 
                  value={ballotStore.affectedKey} 
                  onChange={e => ballotStore.changeBallotMetadata(e, "affectedKey")} 
                />
                <p className="hint">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                </p>
              </div>
            </div>
            <div className="left">
              <div className="form-el">
                <label for="key">Mining Key</label>
                <input type="text" id="key" 
                  value={ballotStore.miningKey} 
                  onChange={e => ballotStore.changeBallotMetadata(e, "miningKey")} 
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
          <div className="new-form-footer">
            <div className="info">
              Minimum 3 from 12 validators  required to pass the proposal
            </div>
            <button type="button" className="add-ballot" onClick={e => this.onClick(e)}>Add ballot</button>
          </div>
        </form>
      </section>
    );
  }
}
