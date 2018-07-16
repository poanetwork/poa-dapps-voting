import React from 'react'
import { inject, observer } from 'mobx-react'

@inject('contractsStore')
@observer
export class Settings extends React.Component {
  render() {
    const { contractsStore } = this.props
    return (
      <section className="container">
        <div className="settings">
          <p className="settings-title">Select Voting Key</p>
          <div className="form-el">
            <select id="state">
              <option value="" default>
                {contractsStore.votingKey}
              </option>
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
    )
  }
}
