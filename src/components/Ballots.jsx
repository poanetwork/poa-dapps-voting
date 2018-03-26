import React from 'react';
import { inject, observer } from "mobx-react";
import "babel-polyfill";

@inject("commonStore", "ballotsStore")
@observer
export class Ballots extends React.Component {
  componentWillMount () {
    const { commonStore } = this.props;
    commonStore.isActiveFilter = this.props.isActiveFilter;
    commonStore.isToFinalizeFilter = this.props.isToFinalizeFilter;
  }

  render () {
    const { ballotsStore } = this.props;
    let filteredBallotCards = ballotsStore.ballotCards.toJS().sort((a, b) => {
      return b.props.startTime - a.props.startTime;
    })
    return (
      <section className="container ballots">
        <h1 className="title">Ballots</h1>
        {filteredBallotCards}
      </section>
    );
  }
}
