import React from 'react';
import { inject, observer } from "mobx-react";
import "babel-polyfill";

@inject("commonStore", "ballotsStore")
@observer
export class Ballots extends React.Component {
  componentWillMount () {
  	const { commonStore } = this.props;
  	commonStore.isActiveFilter = this.props.isActiveFilter;
  }

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
