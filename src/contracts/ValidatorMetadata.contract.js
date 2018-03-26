import Web3 from 'web3';
import moment from 'moment';
import { networkAddresses } from './addresses';
import helpers from "./helpers";
import { toAscii } from "../helpers";

export default class ValidatorMetadata {
  async init({web3, netId}) {
    const {METADATA_ADDRESS} = networkAddresses(netId);
    console.log('Metadata address', METADATA_ADDRESS)
    let web3_10 = new Web3(web3.currentProvider);

    const branch = helpers.getBranch(netId);

    let MetadataAbi = await helpers.getABI(branch, 'ValidatorMetadata')

    this.metadataInstance = new web3_10.eth.Contract(MetadataAbi, METADATA_ADDRESS);
  }

  async getValidatorData({votingKey, miningKey}){
    miningKey = miningKey || await this.getMiningByVoting(votingKey);
    let validatorData = await this.metadataInstance.methods.validators(miningKey).call();
    let createdDate = validatorData.createdDate > 0 ? moment.unix(validatorData.createdDate).format('YYYY-MM-DD') : ''
    let updatedDate = validatorData.updatedDate > 0 ? moment.unix(validatorData.updatedDate).format('YYYY-MM-DD') : ''
    let expirationDate = validatorData.expirationDate > 0 ? moment.unix(validatorData.expirationDate).format('YYYY-MM-DD') : ''
    let postal_code = Number(validatorData.zipcode) || ''
    return {
      firstName: toAscii(validatorData.firstName),
      lastName: toAscii(validatorData.lastName),
      fullAddress: validatorData.fullAddress,
      createdDate,
      updatedDate,
      expirationDate,
      licenseId: toAscii(validatorData.licenseId),
      us_state: toAscii(validatorData.state),
      postal_code,
    }
  }

  async getMiningByVoting(votingKey){
    return await this.metadataInstance.methods.getMiningByVotingKey(votingKey).call();
  }

  async getMinThreshold({miningKey}) {
    let validatorData = await this.metadataInstance.methods.validators(miningKey).call();
    return validatorData.minThreshold;
  }

  validators(_miningKey) {
    return this.metadataInstance.methods.validators(_miningKey).call();
  }
}
