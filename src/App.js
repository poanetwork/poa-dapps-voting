import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { Header, Ballots, NewBallot, Settings, Footer } from './components';
import './assets/App.css';
import DevTools from 'mobx-react-devtools'
import Loading from './Loading';
import { inject, observer } from 'mobx-react';

@inject("commonStore")
@observer
class App extends Component {
  onBallotsRender = () => {
    return <Ballots/>;
  }

  onNewBallotRender = () => {
    return <NewBallot/>;
  }

  onSettingsRender = () => {
    return <Settings/>;
  }

  render() {
    this.rootPath = '/poa-dapps-voting'
    const { commonStore } = this.props;
    const loading = commonStore.loading ? <Loading /> : ''
    return (
      <div>
        {loading}
        <Header />
        <Route exact path={`${this.rootPath}/`} render={this.onBallotsRender}/>
        <Route path={`${this.rootPath}/new`} render={this.onNewBallotRender}/>
        <Route path={`${this.rootPath}/settings`} render={this.onSettingsRender}/>
        <Footer />
        <DevTools />
      </div>
    );
  }
}

export default App;
