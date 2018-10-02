import { constants } from '../constants'
import { messages } from '../messages'
import swal from 'sweetalert2'

function addressesURL(branch) {
  const URL = `https://raw.githubusercontent.com/${constants.organization}/${constants.repoName}/${branch}/${
    constants.addressesSourceFile
  }`
  return URL
}

function ABIURL(branch, contract) {
  const URL = `https://raw.githubusercontent.com/${constants.organization}/${constants.repoName}/${branch}/abis/${
    constants.ABIsSources[contract]
  }`
  return URL
}

function getABI(branch, contract) {
  let addr = ABIURL(branch, contract)
  return fetch(addr).then(response => {
    return response.json()
  })
}

function wrongRepoAlert(addr) {
  swal('Error!', messages.wrongRepo(addr), 'error')
}

function getBranch(netId) {
  switch (netId) {
    case constants.NETID_SOKOL:
      return 'sokol'
    case constants.NETID_DAI_TEST:
      return 'dai-test'
    case constants.NETID_CORE:
      return 'core'
    case constants.NETID_DAI:
      return 'dai'
    default:
      return 'core'
  }
}

module.exports = {
  addressesURL,
  ABIURL,
  getABI,
  wrongRepoAlert,
  getBranch
}
