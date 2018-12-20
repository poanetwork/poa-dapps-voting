import React from 'react'
import { inject, observer } from 'mobx-react'
import { BallotCard } from './BallotCard'

@inject('commonStore', 'routing')
@observer
export class BallotKeysCard extends React.Component {
  render() {
    let { id, votingState, pos } = this.props
    let affectedKeyClassName
    let affectedKey = <p>{votingState.affectedKey}</p>
    let newVotingKey
    let newPayoutKey
    let miningKeyDiv

    if (votingState.isAddMining) {
      affectedKeyClassName = 'sw-BallotAbout-i_key_wide'
      if (votingState.newVotingKey || votingState.newPayoutKey) {
        affectedKey = <p>Mining: {votingState.affectedKey}</p>
        if (votingState.newVotingKey) newVotingKey = <p>Voting: {votingState.newVotingKey}</p>
        if (votingState.newPayoutKey) newPayoutKey = <p>Payout: {votingState.newPayoutKey}</p>
      }
    } else {
      affectedKeyClassName = 'sw-BallotAbout-i_key'
      miningKeyDiv = (
        <div className="sw-BallotAbout-i sw-BallotAbout-i_key">
          <div className="ballots-about-td ballots-about-td-title">
            <p className="sw-BallotAbout-i--title">Validator key</p>
          </div>
          <div className="ballots-about-td ballots-about-td-value">
            <p>{votingState.miningKey}</p>
          </div>
        </div>
      )
    }

    return (
      <BallotCard votingType="votingToChangeKeys" votingState={votingState} id={id} pos={pos}>
        <div className="sw-BallotAbout-i sw-BallotAbout-i_action">
          <div className="ballots-about-td ballots-about-td-title">
            <p className="sw-BallotAbout-i--title">Action</p>
          </div>
          <div className="ballots-about-td ballots-about-td-value">
            <p>{votingState.ballotTypeDisplayName}</p>
          </div>
        </div>
        <div className="sw-BallotAbout-i sw-BallotAbout-i_type">
          <div className="ballots-about-td ballots-about-td-title">
            <p className="sw-BallotAbout-i--title">Key type</p>
          </div>
          <div className="ballots-about-td ballots-about-td-value">
            <p>{votingState.affectedKeyTypeDisplayName}</p>
          </div>
        </div>
        <div className={`sw-BallotAbout-i ${affectedKeyClassName}`}>
          <div className="ballots-about-td ballots-about-td-title">
            <p className="sw-BallotAbout-i--title">Affected key</p>
          </div>
          <div className="ballots-about-td ballots-about-td-value">
            {affectedKey}
            {newVotingKey}
            {newPayoutKey}
          </div>
        </div>
        {miningKeyDiv}
      </BallotCard>
    )
  }
}
