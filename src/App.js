import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { Header, Ballots, NewBallot, Settings, Footer } from './components';
import './assets/App.css';
import DevTools from 'mobx-react-devtools'

class App extends Component {
  render() {
    return (
      <div>
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
