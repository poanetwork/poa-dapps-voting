import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Router, Route } from 'react-router-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { Provider } from 'mobx-react';
import { RouterStore, syncHistoryWithStore } from 'mobx-react-router';
import commonStore from './stores/CommonStore';
import validatorStore from './stores/ValidatorStore';
import ballotStore from './stores/BallotStore';
import ballotsStore from './stores/BallotsStore';
import contractsStore from './stores/ContractsStore';
import swal from 'sweetalert2';
import getWeb3 from './getWeb3';
import "babel-polyfill";
import createBrowserHistory from 'history/createBrowserHistory'

const browserHistory = createBrowserHistory();
const routingStore = new RouterStore();
const stores = { commonStore, contractsStore, ballotStore, ballotsStore, validatorStore, routing: routingStore };
const history = syncHistoryWithStore(browserHistory, routingStore);

class AppMainRouter extends Component {

  constructor(props) {
    super(props);
    commonStore.showLoading();

    getWeb3().then(async (web3Config) => {
      await contractsStore.setWeb3Instance(web3Config);
      await contractsStore.setPoaConsensus(web3Config);
      await contractsStore.setBallotsStorage(web3Config);
      await contractsStore.setVotingToChangeKeys(web3Config);
      await contractsStore.setVotingToChangeMinThreshold(web3Config);
      await contractsStore.setVotingToChangeProxy(web3Config);
      await contractsStore.setValidatorMetadata(web3Config);
      contractsStore.getValidatorsLength();
      contractsStore.getKeysBallotThreshold();
      contractsStore.getMinThresholdBallotThreshold();
      contractsStore.getProxyBallotThreshold();
      contractsStore.getAllKeysBallots();
      contractsStore.getAllMinThresholdBallots();
      contractsStore.getAllProxyBallots();
      contractsStore.setVotingKey(web3Config);
      await contractsStore.setMiningKey(web3Config);
      contractsStore.getValidatorActiveBallots();
      contractsStore.getAllValidatorMetadata();
      console.log("votingKey", contractsStore.votingKey);
      console.log("miningKey", contractsStore.miningKey);
      commonStore.hideLoading();
    }).catch((error) => {
      commonStore.hideLoading();
      console.log(error)
      swal({
        title: 'Error',
        text: error.message,
        type: 'error'
      });
    });
  }

  render(){
    return (
      <Provider { ...stores }>
        <Router history={history}>
          <Route component={App} />
        </Router>
      </Provider>
    )
  }

}

ReactDOM.render(<AppMainRouter />, document.getElementById('root'));
registerServiceWorker();
