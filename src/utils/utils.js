import { constants } from './constants'

export const isTestnet = netId => {
  return netId in constants.NETWORKS && constants.NETWORKS[netId].TESTNET
}

export const isValidNetwork = netId => {
  return netId in constants.NETWORKS
}

export const getNetworkBranch = netId => {
  return constants.NETWORKS[netId].BRANCH
}

export const getNetworkFullName = netId => {
  return constants.NETWORKS[netId].FULLNAME
}

export const scrollToTop = () => {
  document.querySelectorAll('html')[0].scrollTop = 0
}
