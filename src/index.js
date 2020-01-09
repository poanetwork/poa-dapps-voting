import 'babel-polyfill'
import App from './App'
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import ballotStore from './stores/BallotStore'
import ballotsStore from './stores/BallotsStore'
import commonStore from './stores/CommonStore'
import contractsStore from './stores/ContractsStore'
import createBrowserHistory from 'history/createBrowserHistory'
import getWeb3 from './utils/getWeb3'
import registerServiceWorker from './utils/registerServiceWorker'
import swal from 'sweetalert2'
import validatorStore from './stores/ValidatorStore'
import { Provider } from 'mobx-react'
import { Router, Route } from 'react-router-dom'
import { RouterStore, syncHistoryWithStore } from 'mobx-react-router'
import { constants } from './utils/constants'
import { getContractsAddresses } from './contracts/addresses'
import { getNetworkBranch } from './utils/utils'

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

    window.addEventListener('load', () => this.initChain())
  }

  initChain = () => {
    const netId = window.sessionStorage.netId
    getWeb3(netId, contractsStore.updateKeys)
      .then(async web3Config => {
        await this.initialize(web3Config)
        commonStore.hideLoading()
      })
      .catch(error => {
        console.error(error.message)
        commonStore.hideLoading()
        swal({
          title: 'Error',
          html: generateElement(error.message),
          type: 'error'
        })
      })
  }

  initialize = async web3Config => {
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
    if (networkName === constants.CORE || networkName === constants.SOKOL) {
      // if we're in Core or Sokol
      promises.push(contractsStore.setEmissionFunds(web3Config))
      promises.push(contractsStore.setVotingToManageEmissionFunds(web3Config))
    }

    await Promise.all(promises)

    await contractsStore.updateKeys(web3Config.defaultAccount)

    await contractsStore.getMinBallotDurationsAndThresholds()

    await contractsStore.getAllValidatorMetadata()
    await contractsStore.getAllBallots()
  }

  onNetworkChange = e => {
    commonStore.showLoading(getNetworkBranch(e.value))
    window.localStorage.netId = e.value
    window.sessionStorage.netId = e.value
    contractsStore.resetContracts()
    ballotsStore.reset()
    this.initChain()
  }

  render() {
    return (
      <Provider {...stores}>
        <Router history={history}>
          <Route component={props => <App onNetworkChange={this.onNetworkChange} {...props} />} />
        </Router>
      </Provider>
    )
  }
}

ReactDOM.render(<AppMainRouter />, document.getElementById('root'))
registerServiceWorker()
