import React from 'react';

export class Settings extends React.Component {
  render () {
    return (
      <section className="container">
        <div className="settings">
          <p className="settings-title">Select Voting Key</p>
          <div className="form-el">
            <select id="state">
              <option value="" default>Al12s23d34d3d3dd3dq3234frvrt5</option>
            </select>
            <div className="hint">
              Please select your voting key from the list. You will be able to change it later in Settings menu.
            </div>
          </div>
          <div className="center">
            <button type="button">Continue</button>
          </div>
        </div>
      </section>
    );
  }
}
