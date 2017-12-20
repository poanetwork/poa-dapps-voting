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
  render() {
    const { commonStore } = this.props;
    console.log(commonStore.loading)
    const loading = commonStore.loading ? <Loading /> : ''
    return (
      <div>
        {loading}
        <Header />
        <Route exact path="/" component={Ballots}/>
        <Route path="/new" component={NewBallot}/>
        <Route path="/settings" component={Settings}/>
        <Footer />
        <DevTools />
      </div>
    );
  }
}

export default App;
