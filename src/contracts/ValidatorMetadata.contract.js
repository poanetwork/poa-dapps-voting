import Web3 from 'web3'
import { networkAddresses } from './addresses'
import helpers from './helpers'
import { toAscii } from '../helpers'
import { constants } from '../constants'

export default class ValidatorMetadata {
  async init({ web3, netId }) {
    const { METADATA_ADDRESS } = networkAddresses()
    console.log('Metadata address', METADATA_ADDRESS)
    const web3_10 = new Web3(web3.currentProvider)

    const MetadataAbi = await helpers.getABI(constants.NETWORKS[netId].BRANCH, 'ValidatorMetadata')

    this.metadataInstance = new web3_10.eth.Contract(MetadataAbi, METADATA_ADDRESS)
  }

  async getValidatorFullName(miningKey) {
    let validator
    if (this.metadataInstance.methods.getValidatorName) {
      validator = await this.metadataInstance.methods.getValidatorName(miningKey).call()
    } else {
      validator = await this.metadataInstance.methods.validators(miningKey).call()
    }
    return {
      firstName: toAscii(validator.firstName),
      lastName: toAscii(validator.lastName)
    }
  }
}
