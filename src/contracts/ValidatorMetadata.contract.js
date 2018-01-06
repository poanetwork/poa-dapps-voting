import MetadataAbi from './validatorMetadata.abi.json'
import Web3 from 'web3';
import moment from 'moment';
import networkAddresses from './addresses';
var toAscii = function(hex) {
  var str = '',
      i = 0,
      l = hex.length;
  if (hex.substring(0, 2) === '0x') {
      i = 2;
  }
  for (; i < l; i+=2) {
      var code = parseInt(hex.substr(i, 2), 16);
      if (code === 0) continue; // this is added
      str += String.fromCharCode(code);
  }
  return str;
};


export default class Metadata {
  constructor({web3, netId}){
    const {METADATA_ADDRESS} = networkAddresses(netId);
    console.log('Metadata contract:', METADATA_ADDRESS)
    this.web3_10 = new Web3(web3.currentProvider);
    this.metadataInstance = new this.web3_10.eth.Contract(MetadataAbi, METADATA_ADDRESS);
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
