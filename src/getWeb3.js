import { messages } from './messages'

let getWeb3 = () => {
  return new Promise((resolve, reject) => {
    // Wait for loading completion to avoid race conditions with web3 injection timing.
    window.addEventListener('load', () => {
      var results
      var web3 = window.web3

      // Checking if Web3 has been injected by the browser (Mist/MetaMask)
      if (typeof web3 !== 'undefined') {
        // Use Mist/MetaMask's provider.
        var errorMsg = null
        web3 = new window.Web3(web3.currentProvider)
        web3.version.getNetwork((err, netId) => {
          let netIdName
          console.log('netId', netId)
          switch (netId) {
            case '100':
              netIdName = 'Dai'
              console.log('This is Dai', netId)
              break
            case '99':
              netIdName = 'Core'
              console.log('This is Core', netId)
              break
            case '79':
              netIdName = 'Dai-Test'
              console.log('This is Dai-Test', netId)
              break
            case '77':
              netIdName = 'Sokol'
              console.log('This is Sokol', netId)
              break
            default:
              netIdName = 'ERROR'
              errorMsg = messages.WRONG_NETWORK_MSG
              console.log('This is an unknown network.', netId)
          }
          document.title = `${netIdName} - POA Network Governance DApp`
          var defaultAccount = web3.eth.defaultAccount || null
          if (defaultAccount === null) {
            reject({ message: messages.NO_METAMASK_MSG })
          }
          if (errorMsg !== null) {
            reject({ message: errorMsg })
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

        console.log('Injected web3 detected.')
      } else {
        reject({ message: messages.NO_METAMASK_MSG })
        console.error('Metamask not found')
      }
    })
  })
}

export default getWeb3
