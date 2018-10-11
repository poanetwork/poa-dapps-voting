import { networkAddresses } from './addresses'
import helpers from './helpers'
import { toAscii } from '../helpers'
import { constants } from '../constants'

export default class ValidatorMetadata {
  async init({ web3, netId }) {
    const { METADATA_ADDRESS } = networkAddresses()
    console.log('Metadata address', METADATA_ADDRESS)

    const MetadataAbi = await helpers.getABI(constants.NETWORKS[netId].BRANCH, 'ValidatorMetadata')

    this.instance = new web3.eth.Contract(MetadataAbi, METADATA_ADDRESS)
  }

  async getValidatorFullName(miningKey) {
    let validator
    if (this.instance.methods.getValidatorName) {
      validator = await this.instance.methods.getValidatorName(miningKey).call()
    } else {
      validator = await this.instance.methods.validators(miningKey).call()
    }
    return {
      firstName: toAscii(validator.firstName),
      lastName: toAscii(validator.lastName)
    }
  }
}
