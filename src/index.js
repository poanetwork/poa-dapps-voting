import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { Provider } from 'mobx-react';
import newBallotStore from './stores/NewBallotStore';
import contractsStore from './stores/ContractsStore';
import swal from 'sweetalert2';
import getWeb3 from './getWeb3'
import "babel-polyfill";

const stores = { contractsStore, newBallotStore };

function generateElement(msg){
  let errorNode = document.createElement("div");
  errorNode.innerHTML = `<div>
    ${msg}
  </div>`;
  return errorNode;
}

class AppMainRouter extends Component {

  constructor(props) {
    super(props);

    getWeb3().then(async (web3Config) => {
      contractsStore.setVotingToChangeKeys(web3Config);
      contractsStore.setVotingToChangeMinThreshold(web3Config);
      contractsStore.setVotingToChangeProxy(web3Config);
    }).catch((error) => {
      console.error(error.message);
      swal({
        icon: 'error',
        title: 'Error',
        content: generateElement(error.message)
      });
    });
  }

  render(){
    return (
      <Provider { ...stores }>
        <BrowserRouter>
          <App/>
        </BrowserRouter>
      </Provider>
    )
  }

}

ReactDOM.render(<AppMainRouter />, document.getElementById('root'));
registerServiceWorker();
