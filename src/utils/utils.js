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

export const getNetworkName = netId => {
  return constants.NETWORKS[netId].NAME
}
