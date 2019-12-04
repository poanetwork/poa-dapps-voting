import Web3 from 'web3'
import helpers from './helpers'
import { constants } from './constants'

const defaultNetId = helpers.netIdByBranch(constants.CORE)

export default async function getWeb3(netId = defaultNetId, onAccountChange) {
  let web3 = null
  netId = Number(netId)

  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (window.ethereum) {
    web3 = new Web3(window.ethereum)
    console.log('Injected web3 detected.')
    try {
      await window.ethereum.enable()
    } catch (e) {
      throw Error('You have denied access to your accounts')
    }
    window.ethereum.autoRefreshOnNetworkChange = true
  } else if (window.web3) {
    web3 = new Web3(window.web3.currentProvider)
    console.log('Injected web3 detected.')
  }

  const network = constants.NETWORKS[netId]
  const injectedWeb3 = web3 !== null
  let netIdName = network.NAME
  let defaultAccount = null
  let networkMatch = false

  if (web3) {
    const accounts = await web3.eth.getAccounts()
    defaultAccount = accounts[0] || null

    if (!defaultAccount) {
      console.error('Unlock your wallet')
    }

    if (web3.currentProvider.publicConfigStore) {
      let currentAccount = defaultAccount ? defaultAccount.toLowerCase() : ''
      web3.currentProvider.publicConfigStore.on('update', function(obj) {
        const account = obj.selectedAddress
        if (account && account !== currentAccount) {
          currentAccount = account
          onAccountChange(account)
        }
      })
    }

    const web3NetId = await web3.eth.net.getId()
    if (web3NetId === netId) {
      networkMatch = true
    } else {
      web3 = null
    }
  }

  if (!web3) {
    web3 = new Web3(new Web3.providers.HttpProvider(network.RPC))
  }

  document.title = `${netIdName} - POA Governance DApp`

  return {
    web3Instance: web3,
    netId,
    netIdName,
    injectedWeb3,
    defaultAccount,
    networkMatch
  }
}
