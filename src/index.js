import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Router, Route } from 'react-router-dom'
import App from './App'
import registerServiceWorker from './registerServiceWorker'
import { Provider } from 'mobx-react'
import { RouterStore, syncHistoryWithStore } from 'mobx-react-router'
import commonStore from './stores/CommonStore'
import validatorStore from './stores/ValidatorStore'
import ballotStore from './stores/BallotStore'
import ballotsStore from './stores/BallotsStore'
import contractsStore from './stores/ContractsStore'
import { getContractsAddresses } from './contracts/addresses'
import swal from 'sweetalert2'
import getWeb3 from './getWeb3'
import 'babel-polyfill'
import createBrowserHistory from 'history/createBrowserHistory'
import { constants } from './constants'

const browserHistory = createBrowserHistory()
const routingStore = new RouterStore()
const stores = { commonStore, contractsStore, ballotStore, ballotsStore, validatorStore, routing: routingStore }
const history = syncHistoryWithStore(browserHistory, routingStore)

function generateElement(msg) {
  let errorNode = document.createElement('div')
  errorNode.innerHTML = `${msg}`
  return errorNode
}
class AppMainRouter extends Component {
  constructor(props) {
    super(props)
    commonStore.showLoading()

    getWeb3()
      .then(async web3Config => {
        await getContractsAddresses(constants.NETWORKS[web3Config.netId].BRANCH)

        contractsStore.setWeb3Instance(web3Config)

        const setPoaConsensus = contractsStore.setPoaConsensus(web3Config)
        const setBallotsStorage = contractsStore.setBallotsStorage(web3Config)
        const setKeysManager = contractsStore.setKeysManager(web3Config)
        const setProxyStorage = contractsStore.setProxyStorage(web3Config)
        const setVotingToChangeKeys = contractsStore.setVotingToChangeKeys(web3Config)
        const setVotingToChangeMinThreshold = contractsStore.setVotingToChangeMinThreshold(web3Config)
        const setVotingToChangeProxy = contractsStore.setVotingToChangeProxy(web3Config)
        const setValidatorMetadata = contractsStore.setValidatorMetadata(web3Config)

        let promises = [
          setPoaConsensus,
          setBallotsStorage,
          setKeysManager,
          setProxyStorage,
          setVotingToChangeKeys,
          setVotingToChangeMinThreshold,
          setVotingToChangeProxy,
          setValidatorMetadata
        ]

        const networkName = constants.NETWORKS[web3Config.netId].NAME.toLowerCase()
        if (networkName === 'core' || networkName === 'sokol') {
          // if we're in Core or Sokol
          promises.push(contractsStore.setEmissionFunds(web3Config))
          promises.push(contractsStore.setVotingToManageEmissionFunds(web3Config))
        }

        await Promise.all(promises)

        await contractsStore.setMiningKey(web3Config)
        await contractsStore.setVotingKey(web3Config)

        contractsStore.getKeysBallotThreshold()
        contractsStore.getProxyBallotThreshold()
        contractsStore.getBallotCancelingThreshold()
        contractsStore.getBallotsLimits()

        await contractsStore.getAllValidatorMetadata()
        await contractsStore.getAllBallots()

        console.log('votingKey', contractsStore.votingKey)
        console.log('miningKey', contractsStore.miningKey)

        commonStore.hideLoading()
      })
      .catch(error => {
        console.error(error.message)
        commonStore.hideLoading()
        swal({
          title: 'Error',
          html: generateElement(error.message),
          icon: 'error',
          type: 'error'
        })
      })
  }

  render() {
    return (
      <Provider {...stores}>
        <Router history={history}>
          <Route component={App} />
        </Router>
      </Provider>
    )
  }
}

ReactDOM.render(<AppMainRouter />, document.getElementById('root'))
registerServiceWorker()
