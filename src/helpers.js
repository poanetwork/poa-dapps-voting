import Web3 from 'web3'
import swal from 'sweetalert2'
import { constants } from './constants'

var toAscii = hex => {
  var str = '',
    i = 0,
    l = hex.length
  if (hex.substring(0, 2) === '0x') {
    i = 2
  }
  for (; i < l; i += 2) {
    var code = parseInt(hex.substr(i, 2), 16)
    if (code === 0) continue // this is added
    str += String.fromCharCode(code)
  }
  return str
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function sendTransactionByVotingKey(props, to, data, cb, warning) {
  const { commonStore, contractsStore } = props
  const web3 = new Web3(contractsStore.web3Instance.currentProvider)

  web3.eth.sendTransaction(
    {
      from: contractsStore.votingKey,
      to,
      gasPrice: web3.utils.toWei('1', 'gwei'),
      data
    },
    async (error, hash) => {
      if (error) {
        commonStore.hideLoading()
        swal('Error!', error.message, 'error')
      } else {
        try {
          let tx
          do {
            await sleep(constants.getTransactionReceiptInterval)
            tx = await web3.eth.getTransactionReceipt(hash)
          } while (tx === null)

          commonStore.hideLoading()
          if (tx.status === true || tx.status === '0x1') {
            await cb(tx)
          } else {
            swal('Warning!', warning, 'warning')
          }
        } catch (e) {
          commonStore.hideLoading()
          swal('Error!', e.message, 'error')
        }
      }
    }
  )
}

function isTestnet(netId) {
  return netId === constants.NETID_SOKOL || netId === constants.NETID_DAI_TEST
}

module.exports = {
  toAscii,
  sendTransactionByVotingKey,
  isTestnet
}
