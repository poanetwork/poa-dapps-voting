import React from 'react';
import { observable } from "mobx";
import { inject, observer } from "mobx-react";
import "babel-polyfill";

@inject("commonStore", "ballotsStore")
@observer
export class Ballots extends React.Component {
  @observable limit;

  constructor(props) {
    super(props);
    this.limit = this.props.commonStore.loadMoreLimit;
    this.step = this.limit;
    this.onClick = this.onClick.bind(this);
  }

  onClick = async () => {
    const { commonStore } = this.props;
    this.limit += this.step;
    commonStore.loadMoreLimit = this.limit;
  }

  componentWillMount () {
    const { commonStore } = this.props;
    commonStore.isActiveFilter = this.props.isActiveFilter;
    commonStore.isToFinalizeFilter = this.props.isToFinalizeFilter;
  }

  render () {
    const { ballotsStore, commonStore } = this.props;
    let ballotCards = ballotsStore.ballotCards.toJS().sort((a, b) => {
      return b.props.startTime - a.props.startTime;
    })
    let loadMoreButton;
    if (ballotCards.length > this.limit && !commonStore.isActiveFilter && !commonStore.isToFinalizeFilter) {
      loadMoreButton = <div className="center">
        <button type="button" className="load-more" onClick={e => this.onClick(e)}>&darr; LOAD MORE BALLOTS &darr;</button>
      </div>;
      ballotCards.splice(this.limit);
    }
    return (
      <section className="container ballots">
        <h1 className="title">Ballots</h1>
        {ballotCards}
        {loadMoreButton}
      </section>
    );
  }
}
