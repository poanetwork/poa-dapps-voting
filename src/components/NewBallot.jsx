import React from 'react';

/* stores */
import NewBallotStore from "../stores/new-ballot.js";


export class NewBallot extends React.Component {
  onClick() {
    console.log("create ballot");
  }

  render() {
    return (
      <section className="container new">
        <h1 className="title">New Ballot</h1>
        <form action="" className="new-form">
          <div className="hidden">
            <div className="left">
              <div className="radio-container">
                <input type="radio" name="ballot-type" id="ballot-for-validators" checked />
                <label for="ballot-for-validators" className="radio">Ballot for validators</label>
                <p className="hint">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                  eiusmod tempor incididunt ut labore
                </p>
              </div>
            </div>
            <div className="right">
              <div className="radio-container">
                <input type="radio" name="ballot-type" id="ballot-for-consensus" />
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
                <input type="text" id="full-name" />
                <p className="hint">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                </p>
              </div>
            </div>
            <div className="right">
              <div className="form-el">
                <label for="address">Address</label>
                <input type="text" id="address" />
                <p className="hint">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                </p>
              </div>
            </div>
            <div className="left">
              <div className="form-el">
                <label for="state">State</label>
                <select id="state">
                  <option value=""></option>
                  <option value="">Alabama</option>
                  <option value="">Florida</option>
                  <option value="">New York</option>
                  <option value="">Washington</option>
                </select>
                <p className="hint">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                </p>
              </div>
            </div>
            <div className="right">
              <div className="form-el">
                <label for="zip-code">Zip Code</label>
                <input type="text" id="zip-code" />
                <p className="hint">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                </p>
              </div>
            </div>
            <div className="left">
              <div className="form-el">
                <label for="license-id">License ID</label>
                <input type="text" id="license-id" />
                <p className="hint">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                </p>
              </div>
            </div>
            <div className="right">
              <div className="form-el">
                <label for="license-expiration">License Expiration</label>
                <input type="text" id="license-expiration" />
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
                <input type="radio" name="key-control" id="add-key" checked />
                <label for="add-key" className="radio radio_icon radio_add">Add key</label>
                <p className="hint">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                </p>
              </div>
              <div className="radio-container">
                <input type="radio" name="key-control" id="remove-key" />
                <label for="remove-key" className="radio radio_icon radio_remove">Remove key</label>
                <p className="hint">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                </p>
              </div>
              <div className="radio-container">
                <input type="radio" name="key-control" id="swap-key" />
                <label for="swap-key" className="radio radio_icon radio_swap">Swap key</label>
                <p className="hint">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                </p>
              </div>
            </div>
            <div className="right">
              <div className="radio-container">
                <input type="radio" name="keys" id="mining-key" checked />
                <label for="mining-key" className="radio">Mining Key</label>
                <p className="hint">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                </p>
              </div>
              <div className="radio-container">
                <input type="radio" name="keys" id="payout-key" />
                <label for="payout-key" className="radio">Payout Key</label>
                <p className="hint">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                </p>
              </div>
              <div className="radio-container">
                <input type="radio" name="keys" id="voting-key" />
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
                <input type="text" id="memo" />
                <p className="hint">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                </p>
              </div>
            </div>
            <div className="right">
              <div className="form-el">
                <label for="key">Key</label>
                <input type="text" id="key" />
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
