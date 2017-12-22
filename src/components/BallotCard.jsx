import React from 'react';
import { inject, observer } from "mobx-react";

@inject("commonStore", "contractsStore", "ballotsStore")
@observer
export class BallotCard extends React.Component {
  constructor(props) {
    super(props);
  }

  render () {
    return (
      <div className="ballots-i">
        <div className="ballots-about">
          <div className="ballots-about-i ballots-about-i_name">
            <div className="ballots-about-td">
              <p className="ballots-about-i--title">Name</p>
            </div>
            <div className="ballots-about-td">
              <p className="ballots-i--name">Suleyman Duyar</p>
              <p className="ballots-i--created">31/10/2017 7:22 AM</p>
            </div>
          </div>
          <div className="ballots-about-i ballots-about-i_proposal">
            <div className="ballots-about-td">
              <p className="ballots-about-i--title">Proposal</p>
            </div>
            <div className="ballots-about-td">
              <p>Remove notary Shawn Grey, Vermont ID: 55512345 ...</p>
              <a href="#" className="ballots-i--see-all-proposal">See All</a>
            </div>
          </div>
          <div className="ballots-about-i ballots-about-i_mining-key">
            <div className="ballots-about-td">
              <p className="ballots-about-i--title">Mining key</p>
            </div>
            <div className="ballots-about-td">
              <p>0xA1Cf735Ab55e9840Be820261D9b404959fcB5e41</p>
            </div>
          </div>
          <div className="ballots-about-i ballots-about-i_time">
            <div className="ballots-about-td">
              <p className="ballots-about-i--title">Time</p>
            </div>
            <div className="ballots-about-td">
              <p className="ballots-i--time">17:49</p>
              <p className="ballots-i--to-close">To close</p>
            </div>
          </div>
        </div>
        <div className="ballots-i-scale">
          <div className="ballots-i-scale-column">
            <a href="#" className="ballots-i--vote ballots-i--vote_yes">Vote</a>
            <div className="vote-scale--container">
              <p className="vote-scale--value">Yes</p>
              <p className="vote-scale--votes">Votes: 40</p>
              <p className="vote-scale--percentage">40%</p>
              <div className="vote-scale">
                <div className="vote-scale--fill vote-scale--fill_yes" style={{width: '50%'}}></div>
              </div>
            </div>
          </div>
          <div className="ballots-i-scale-column">
            <div className="vote-scale--container">
              <p className="vote-scale--value">No</p>
              <p className="vote-scale--votes">Votes: 10</p>
              <p className="vote-scale--percentage">20%</p>
              <div className="vote-scale">
                <div className="vote-scale--fill vote-scale--fill_no" style={{width: '30%'}}></div>
              </div>
            </div>
            <a href="#" className="ballots-i--vote ballots-i--vote_no">Vote</a>
          </div>
        </div>
        <div className="info">
          Minimum 3 from 12 validators  required to pass the proposal
        </div>
        <hr />
        <div className="ballots-footer">
          <a href="#" className="ballots-footer-finalize">Finalize ballot</a>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore</p>
        </div>
      </div>
    );
  }
}
