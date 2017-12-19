import React from 'react';
import { inject, observer } from "mobx-react";
import Select from 'react-select';

@inject("newBallotStore")
@observer
export class NewBallot extends React.Component {
  constructor(props) {
    super(props);
  }

  onClick() {
    console.log("create ballot");
  }

  render() {
    const { newBallotStore } = this.props;
    return (
      <section className="container new">
        <h1 className="title">New Ballot</h1>
        <form action="" className="new-form">
          <div className="hidden">
            <div className="left">
              <div className="radio-container">
                <input type="radio" name="ballot-type" id="ballot-for-validators" 
                  value={newBallotStore.BallotType.keys}
                  checked={newBallotStore.isBallotForKey} 
                  onChange={e => newBallotStore.changeBallotType(e, newBallotStore.BallotType.keys)}
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
                  value={newBallotStore.BallotType.minThreshold}
                  checked={newBallotStore.isBallotForMinThreshold} 
                  onChange={e => newBallotStore.changeBallotType(e, newBallotStore.BallotType.minThreshold)}
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
                  value={newBallotStore.validatorMetadata.fullName} 
                  onChange={e => newBallotStore.changeValidatorMetadata(e, "fullName")}
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
                  value={newBallotStore.validatorMetadata.address} 
                  onChange={e => newBallotStore.changeValidatorMetadata(e, "address")}
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
                  value={newBallotStore.validatorMetadata.state}
                  onChange={e => newBallotStore.changeValidatorMetadata(e, "state")}
                  options={[
                    { value: '', label: '' },
                    { value: 'Alabama', label: 'Alabama' },
                    { value: 'Florida', label: 'Florida' },
                  ]}
                >
                  {/*<option value=""></option>
                  <option value="">Alabama</option>
                  <option value="">Florida</option>
                  <option value="">New York</option>
                  <option value="">Washington</option>*/}
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
                  value={newBallotStore.validatorMetadata.zipCode} 
                  onChange={e => newBallotStore.changeValidatorMetadata(e, "zipCode")}
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
                  value={newBallotStore.validatorMetadata.licenseID} 
                  onChange={e => newBallotStore.changeValidatorMetadata(e, "licenseID")}
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
                  value={newBallotStore.validatorMetadata.licenseExpiration} 
                  onChange={e => newBallotStore.changeValidatorMetadata(e, "licenseExpiration")}
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
                  value={newBallotStore.KeysBallotType.add}
                  checked={newBallotStore.isAddKeysBallotType} 
                  onChange={e => newBallotStore.changeKeysBallotType(e, newBallotStore.KeysBallotType.add)}
                />
                <label for="add-key" className="radio radio_icon radio_add">Add key</label>
                <p className="hint">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                </p>
              </div>
              <div className="radio-container">
                <input type="radio" name="key-control" id="remove-key" 
                  value={newBallotStore.KeysBallotType.remove}
                  checked={newBallotStore.isRemoveKeysBallotType} 
                  onChange={e => newBallotStore.changeKeysBallotType(e, newBallotStore.KeysBallotType.remove)}
                />
                <label for="remove-key" className="radio radio_icon radio_remove">Remove key</label>
                <p className="hint">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                </p>
              </div>
              <div className="radio-container">
                <input type="radio" name="key-control" id="swap-key" 
                  value={newBallotStore.KeysBallotType.swap}
                  checked={newBallotStore.isSwapKeysBallotType} 
                  onChange={e => newBallotStore.changeKeysBallotType(e, newBallotStore.KeysBallotType.swap)}
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
                  value={newBallotStore.KeyType.mining}
                  checked={newBallotStore.isMiningKeyType} 
                  onChange={e => newBallotStore.changeKeyType(e, newBallotStore.KeyType.mining)}
                />
                <label for="mining-key" className="radio">Mining Key</label>
                <p className="hint">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                </p>
              </div>
              <div className="radio-container">
                <input type="radio" name="keys" id="payout-key" 
                  value={newBallotStore.KeyType.payout}
                  checked={newBallotStore.isPayoutKeyType} 
                  onChange={e => newBallotStore.changeKeyType(e, newBallotStore.KeyType.payout)}
                />
                <label for="payout-key" className="radio">Payout Key</label>
                <p className="hint">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                </p>
              </div>
              <div className="radio-container">
                <input type="radio" name="keys" id="voting-key" 
                  value={newBallotStore.KeyType.voting}
                  checked={newBallotStore.isVotingKeyType} 
                  onChange={e => newBallotStore.changeKeyType(e, newBallotStore.KeyType.voting)}
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
                  value={newBallotStore.ballotMetadata.memo} 
                  onChange={e => newBallotStore.changeBallotMetadata(e, "memo")} 
                />
                <p className="hint">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                </p>
              </div>
            </div>
            <div className="right">
              <div className="form-el">
                <label for="key">Key</label>
                <input type="text" id="key" 
                  value={newBallotStore.ballotMetadata.affectedKey} 
                  onChange={e => newBallotStore.changeBallotMetadata(e, "affectedKey")} 
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
            <button type="button" className="add-ballot" onClick={this.onClick}>Add ballot</button>
          </div>
        </form>
      </section>
    );
  }
}
