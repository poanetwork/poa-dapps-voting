import React from 'react';
import { inject, observer, observable } from "mobx-react";
import { BallotCard } from "./BallotCard";
import "babel-polyfill";

@inject("commonStore", "contractsStore", "ballotStore", "ballotsStore")
@observer
export class Ballots extends React.Component {
  constructor(props) {
    super(props);
  }

  render () {
    const { commonStore, ballotsStore } = this.props;
    if (ballotsStore.ballotCards.length > 0) {
      commonStore.hideLoading();
    } else {
      commonStore.showLoading();
    }
    return (
      <section className="container ballots">
        <h1 className="title">Ballots</h1>
        {ballotsStore.ballotCards.toJS()}
      </section>
    );
  }
}
