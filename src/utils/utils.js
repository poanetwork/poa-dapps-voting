import { constants } from './constants'

export const getNetworkBranch = netId => {
  return constants.NETWORKS[netId].BRANCH
}

export const getNetworkFullName = netId => {
  return constants.NETWORKS[netId].FULLNAME
}

export const scrollToTop = () => {
  document.querySelectorAll('html')[0].scrollTop = 0
}
