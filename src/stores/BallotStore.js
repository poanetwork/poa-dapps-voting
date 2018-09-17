import { observable, computed, action, toJS } from 'mobx'
import moment from 'moment'
import { constants } from '../constants'

class BallotStore {
  BallotType = {
    keys: 1,
    minThreshold: 2,
    proxy: 3,
    emissionFunds: 4
  }
  KeysBallotType = {
    add: 1,
    remove: 2,
    swap: 3
  }
  KeyType = {
    mining: 1,
    voting: 2,
    payout: 3
  }
  ProxyBallotType = {
    1: 'KeysManager',
    2: 'VotingToChangeKeys',
    3: 'VotingToChangeMinThreshold',
    4: 'VotingToChangeProxy',
    5: 'BallotsStorage',
    7: 'ValidatorMetadata',
    8: 'ProxyStorage'
  }
  @observable ballotType
  @observable keysBallotType
  @observable endTime

  @observable ballotKeys
  @observable ballotMinThreshold
  @observable ballotProxy
  @observable ballotEmissionFunds

  @observable memo

  constructor() {
    this.ballotType = null
    this.endTime = moment()
      .add(constants.endTimeDefaultInMinutes, 'minutes')
      .format('YYYY-MM-DDTHH:mm')

    this.ballotKeys = {
      keyType: null,
      keysBallotType: null,
      affectedKey: '',
      newVotingKey: '',
      newPayoutKey: '',
      miningKey: ''
    }

    this.ballotMinThreshold = {
      proposedValue: ''
    }

    this.ballotProxy = {
      proposedAddress: '',
      contractType: ''
    }

    this.ballotEmissionFunds = {
      receiver: ''
    }

    this.memo = ''
  }

  @computed
  get endTimeUnix() {
    console.log(this.endTime)
    return moment(this.endTime).unix()
  }

  @computed
  get isBallotForKey() {
    return this.ballotType === this.BallotType.keys
  }

  @computed
  get isBallotForMinThreshold() {
    return this.ballotType === this.BallotType.minThreshold
  }

  @computed
  get isBallotForProxy() {
    return this.ballotType === this.BallotType.proxy
  }

  @computed
  get isBallotForEmissionFunds() {
    return this.ballotType === this.BallotType.emissionFunds
  }

  @computed
  get isAddKeysBallotType() {
    return this.ballotKeys.keysBallotType === this.KeysBallotType.add
  }

  @computed
  get isRemoveKeysBallotType() {
    return this.ballotKeys.keysBallotType === this.KeysBallotType.remove
  }

  @computed
  get isSwapKeysBallotType() {
    return this.ballotKeys.keysBallotType === this.KeysBallotType.swap
  }

  @computed
  get isMiningKeyType() {
    return this.ballotKeys.keyType === this.KeyType.mining
  }

  @computed
  get isVotingKeyType() {
    return this.ballotKeys.keyType === this.KeyType.voting
  }

  @computed
  get isPayoutKeyType() {
    return this.ballotKeys.keyType === this.KeyType.payout
  }

  @computed
  get isNewValidatorPersonalData() {
    return ballotStore.isBallotForKey && ballotStore.isAddKeysBallotType && ballotStore.isMiningKeyType
  }

  @action('change ballot type')
  changeBallotType = (e, _ballotType) => {
    console.log('change ballot type', _ballotType)
    this.ballotType = _ballotType
  }

  @action('change keys ballot type')
  changeKeysBallotType = (e, _keysBallotType) => {
    console.log('change keys ballot type', _keysBallotType)
    this.ballotKeys.keysBallotType = _keysBallotType
  }

  @action('change affected key type')
  changeKeyType = (e, _keyType) => {
    console.log('change affected key type', _keyType)
    this.ballotKeys.keyType = _keyType
  }

  @action('change ballot metadata')
  changeBallotMetadata = (e, field, parent) => {
    let newVal = e ? (e.target ? e.target.value : e.value) : ''
    if (parent) this[parent][field] = newVal
    else this[field] = newVal
    console.log('ballot metadata', field, parent ? this[parent][field] : this[field])
  }
  @action('change ballot metadata')
  setMiningKey = value => {
    this.ballotKeys.miningKey = value
    console.log('ballot mining key', toJS(value))
  }

  @action('Set ballot memo')
  setMemo(e) {
    console.log('memo', this.memo)
    this.memo = e.target.value
  }
}

const ballotStore = new BallotStore()

export default ballotStore
export { BallotStore }
