import React from 'react';
import { inject, observer } from "mobx-react";
import "babel-polyfill";

@inject("ballotsStore")
@observer
export class Ballots extends React.Component {
  render () {
    const { ballotsStore } = this.props;
    return (
      <section className="container ballots">
        <h1 className="title">Ballots</h1>
        {ballotsStore.ballotCards.toJS()}
      </section>
    );
  }
}
