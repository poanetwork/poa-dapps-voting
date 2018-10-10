import { messages } from './messages'
import { constants } from './constants'

let getWeb3 = () => {
  return new Promise((resolve, reject) => {
    // Wait for loading completion to avoid race conditions with web3 injection timing.
    window.addEventListener('load', async () => {
      let results
      let web3 = window.web3

      // Checking if Web3 has been injected by the browser (Mist/MetaMask)
      if (window.ethereum) {
        web3 = new window.Web3(window.ethereum)
        console.log('Injected web3 detected.')
        try {
          await window.ethereum.enable()
        } catch (e) {
          console.error('User denied account access')
          reject({ message: messages.USER_DENIED_ACCOUNT_ACCESS })
          return
        }
      } else if (typeof web3 !== 'undefined') {
        web3 = new window.Web3(web3.currentProvider)
        console.log('Injected web3 detected.')
      } else {
        console.error('Metamask not found')
        reject({ message: messages.NO_METAMASK_MSG })
        return
      }

      let errorMsg = null
      web3.version.getNetwork((err, netId) => {
        let netIdName
        console.log('netId', netId)
        switch (netId) {
          case constants.NETID_DAI:
            netIdName = 'Dai'
            console.log('This is Dai', netId)
            break
          case constants.NETID_CORE:
            netIdName = 'Core'
            console.log('This is Core', netId)
            break
          case constants.NETID_DAI_TEST:
            netIdName = 'Dai-Test'
            console.log('This is Dai-Test', netId)
            break
          case constants.NETID_SOKOL:
            netIdName = 'Sokol'
            console.log('This is Sokol', netId)
            break
          default:
            netIdName = 'ERROR'
            errorMsg = messages.WRONG_NETWORK_MSG
            console.log('This is an unknown network.', netId)
        }
        document.title = `${netIdName} - POA Network Governance DApp`
        if (errorMsg !== null) {
          reject({ message: errorMsg })
          return
        }
        var defaultAccount = web3.eth.defaultAccount || null
        if (defaultAccount === null) {
          reject({ message: messages.NO_METAMASK_MSG })
          return
        }
        results = {
          web3Instance: web3,
          netIdName,
          netId,
          injectedWeb3: true,
          defaultAccount
        }
        resolve(results)
      })
    })
  })
}

export default getWeb3
