import { observable, computed, action } from 'mobx'
import React from 'react'

import PoaConsensus from '../contracts/PoaConsensus.contract'
import BallotsStorage from '../contracts/BallotsStorage.contract'
import EmissionFunds from '../contracts/EmissionFunds.contract'
import KeysManager from '../contracts/KeysManager.contract'
import ProxyStorage from '../contracts/ProxyStorage.contract'
import VotingToChangeKeys from '../contracts/VotingToChangeKeys.contract'
import VotingToChangeMinThreshold from '../contracts/VotingToChangeMinThreshold.contract'
import VotingToChangeProxy from '../contracts/VotingToChangeProxy.contract'
import VotingToManageEmissionFunds from '../contracts/VotingToManageEmissionFunds.contract'
import ValidatorMetadata from '../contracts/ValidatorMetadata.contract'
import ballotStore from './BallotStore'
import ballotsStore from './BallotsStore'
import commonStore from './CommonStore'
import { BallotKeysCard } from '../components/BallotKeysCard'
import { BallotMinThresholdCard } from '../components/BallotMinThresholdCard'
import { BallotProxyCard } from '../components/BallotProxyCard'
import { BallotEmissionFundsCard } from '../components/BallotEmissionFundsCard'
import { constants } from '../utils/constants'

import 'babel-polyfill'

class ContractsStore {
  @observable poaConsensus
  @observable ballotsStorage
  @observable emissionFunds
  @observable keysManager
  @observable proxyStorage
  @observable votingToChangeKeys
  @observable votingToChangeMinThreshold
  @observable votingToChangeProxy
  @observable votingToManageEmissionFunds
  @observable validatorMetadata
  @observable votingKey
  @observable miningKey
  @observable web3Instance
  @observable validatorsLength
  @observable keysBallotThreshold
  @observable minThresholdBallotThreshold
  @observable proxyBallotThreshold
  @observable emissionFundsBallotThreshold
  @observable ballotCancelingThreshold
  @observable validatorLimits
  @observable minBallotDuration
  @observable validatorsMetadata
  @observable netId
  @observable injectedWeb3

  constructor() {
    this.votingKey = null
    this.miningKey = null
    this.validatorsMetadata = {}
    this.validatorLimits = { keys: null, minThreshold: null, proxy: null }
    this.minBallotDuration = { keys: 0, minThreshold: 0, proxy: 0 }
    this.injectedWeb3 = false
  }

  @computed
  get isValidVotingKey() {
    if (this.miningKey && this.miningKey !== '0x0000000000000000000000000000000000000000') return true
    return false
  }

  @action('Get keys ballot threshold')
  getKeysBallotThreshold = async () => {
    this.keysBallotThreshold = await this.ballotsStorage.instance.methods.getBallotThreshold(1).call()
    this.minThresholdBallotThreshold = this.keysBallotThreshold
  }

  @action('Get proxy ballot threshold')
  getProxyBallotThreshold = async () => {
    this.proxyBallotThreshold = await this.ballotsStorage.instance.methods.getProxyThreshold().call()
    this.emissionFundsBallotThreshold = this.proxyBallotThreshold
  }

  @action('Get ballot canceling threshold')
  getBallotCancelingThreshold = async () => {
    this.ballotCancelingThreshold = this.votingToManageEmissionFunds
      ? Number(await this.votingToManageEmissionFunds.ballotCancelingThreshold())
      : 0
  }

  @action('Set web3Instance')
  setWeb3Instance = web3Config => {
    this.web3Instance = web3Config.web3Instance
    this.netId = web3Config.netId
    this.injectedWeb3 = web3Config.injectedWeb3
    this.networkMatch = web3Config.networkMatch
  }

  @action('Reset contracts')
  resetContracts = () => {
    this.poaConsensus = null
    this.ballotsStorage = null
    this.emissionFunds = null
    this.keysManager = null
    this.proxyStorage = null
    this.votingToChangeKeys = null
    this.votingToChangeMinThreshold = null
    this.votingToChangeProxy = null
    this.votingToManageEmissionFunds = null
    this.validatorMetadata = null
  }

  @action('Set PoA Consensus contract')
  setPoaConsensus = async web3Config => {
    this.poaConsensus = new PoaConsensus()
    await this.poaConsensus.init({
      web3: web3Config.web3Instance,
      netId: web3Config.netId
    })
  }

  @action('Set Ballots Storage contract')
  setBallotsStorage = async web3Config => {
    this.ballotsStorage = new BallotsStorage()
    await this.ballotsStorage.init({
      web3: web3Config.web3Instance,
      netId: web3Config.netId
    })
  }

  @action('Set EmissionFunds contract')
  setEmissionFunds = async web3Config => {
    this.emissionFunds = new EmissionFunds()
    await this.emissionFunds.init({
      web3: web3Config.web3Instance,
      netId: web3Config.netId
    })
  }

  @action('Set KeysManager contract')
  setKeysManager = async web3Config => {
    this.keysManager = new KeysManager()
    await this.keysManager.init({
      web3: web3Config.web3Instance,
      netId: web3Config.netId
    })
  }

  @action('Set ProxyStorage contract')
  setProxyStorage = async web3Config => {
    this.proxyStorage = new ProxyStorage()
    await this.proxyStorage.init({
      web3: web3Config.web3Instance,
      netId: web3Config.netId
    })
  }

  @action('Set VotingToChangeKeys contract')
  setVotingToChangeKeys = async web3Config => {
    this.votingToChangeKeys = new VotingToChangeKeys()
    await this.votingToChangeKeys.init({
      web3: web3Config.web3Instance,
      netId: web3Config.netId
    })
  }

  @action('Set VotingToChangeMinThreshold contract')
  setVotingToChangeMinThreshold = async web3Config => {
    this.votingToChangeMinThreshold = new VotingToChangeMinThreshold()
    await this.votingToChangeMinThreshold.init({
      web3: web3Config.web3Instance,
      netId: web3Config.netId
    })
  }

  @action('Set VotingToChangeProxy contract')
  setVotingToChangeProxy = async web3Config => {
    this.votingToChangeProxy = new VotingToChangeProxy()
    await this.votingToChangeProxy.init({
      web3: web3Config.web3Instance,
      netId: web3Config.netId
    })
  }

  @action('Set VotingToManageEmissionFunds contract')
  setVotingToManageEmissionFunds = async web3Config => {
    this.votingToManageEmissionFunds = new VotingToManageEmissionFunds()
    await this.votingToManageEmissionFunds.init({
      web3: web3Config.web3Instance,
      netId: web3Config.netId
    })
  }

  @action('Set ValidatorMetadata contract')
  setValidatorMetadata = async web3Config => {
    this.validatorMetadata = new ValidatorMetadata()
    await this.validatorMetadata.init({
      web3: web3Config.web3Instance,
      netId: web3Config.netId
    })
  }

  @action('Get validators length')
  getValidatorsLength = async () => {
    this.validatorsLength = await this.poaConsensus.instance.methods.getCurrentValidatorsLength().call()
  }

  @action('Set voting key')
  setVotingKey = account => {
    this.votingKey = account
  }

  @action('Set mining key')
  setMiningKey = async account => {
    try {
      this.miningKey = await this.keysManager.instance.methods.miningKeyByVoting(account).call()
    } catch (e) {
      console.log(e)
      this.miningKey = '0x0000000000000000000000000000000000000000'
    }
  }

  @action('Get all keys ballots')
  getAllBallots = async () => {
    let keysNextBallotId = 0,
      minThresholdNextBallotId = 0,
      proxyNextBallotId = 0,
      emissionFundsNextBallotId = 0
    try {
      ;[
        keysNextBallotId,
        minThresholdNextBallotId,
        proxyNextBallotId,
        emissionFundsNextBallotId
      ] = await this.getAllBallotsNextIDs()
      keysNextBallotId = Number(keysNextBallotId)
      minThresholdNextBallotId = Number(minThresholdNextBallotId)
      proxyNextBallotId = Number(proxyNextBallotId)
      emissionFundsNextBallotId = Number(emissionFundsNextBallotId)
    } catch (e) {
      console.log(e.message)
    }

    const allKeysPromise = this.getCards(keysNextBallotId, 'votingToChangeKeys')
    const allMinThresholdPromise = this.getCards(minThresholdNextBallotId, 'votingToChangeMinThreshold')
    const allProxyPromise = this.getCards(proxyNextBallotId, 'votingToChangeProxy')
    const allEmissionFundsPromise = this.getCards(emissionFundsNextBallotId, 'votingToManageEmissionFunds')

    await Promise.all([allKeysPromise, allMinThresholdPromise, allProxyPromise, allEmissionFundsPromise])

    const allBallotsIDsLength =
      keysNextBallotId + minThresholdNextBallotId + proxyNextBallotId + emissionFundsNextBallotId

    if (allBallotsIDsLength === 0) {
      commonStore.hideLoading()
    }
  }

  fillCardVotingState = (votingState, contractType) => {
    const creatorLowerCase = votingState.creator.toLowerCase()
    votingState.creatorMiningKey = votingState.creator
    if (this.validatorsMetadata.hasOwnProperty(creatorLowerCase)) {
      const creatorFullName = this.validatorsMetadata[creatorLowerCase].fullName
      if (creatorFullName) {
        votingState.creator = creatorFullName
      }
    }

    if (contractType === 'votingToChangeKeys') {
      votingState.isAddMining = false

      switch (Number(votingState.ballotType)) {
        case ballotStore.KeysBallotType.add:
          votingState.ballotTypeDisplayName = 'add'
          if (Number(votingState.affectedKeyType) === ballotStore.KeyType.mining) {
            votingState.isAddMining = true
          }
          break
        case ballotStore.KeysBallotType.remove:
          votingState.ballotTypeDisplayName = 'remove'
          break
        case ballotStore.KeysBallotType.swap:
          votingState.ballotTypeDisplayName = 'swap'
          break
        default:
          votingState.ballotTypeDisplayName = ''
          break
      }

      if (!votingState.hasOwnProperty('newVotingKey')) {
        votingState.newVotingKey = ''
      }
      if (votingState.newVotingKey === '0x0000000000000000000000000000000000000000') {
        votingState.newVotingKey = ''
      }

      if (!votingState.hasOwnProperty('newPayoutKey')) {
        votingState.newPayoutKey = ''
      }
      if (votingState.newPayoutKey === '0x0000000000000000000000000000000000000000') {
        votingState.newPayoutKey = ''
      }

      switch (Number(votingState.affectedKeyType)) {
        case ballotStore.KeyType.mining:
          votingState.affectedKeyTypeDisplayName = 'mining'
          break
        case ballotStore.KeyType.voting:
          votingState.affectedKeyTypeDisplayName = 'voting'
          break
        case ballotStore.KeyType.payout:
          votingState.affectedKeyTypeDisplayName = 'payout'
          break
        default:
          votingState.affectedKeyTypeDisplayName = ''
          break
      }
      if (votingState.isAddMining) {
        if (votingState.newVotingKey) votingState.affectedKeyTypeDisplayName += ', voting'
        if (votingState.newPayoutKey) votingState.affectedKeyTypeDisplayName += ', payout'
      }

      if (votingState.miningKey && votingState.miningKey !== '0x0000000000000000000000000000000000000000') {
        const miningKeyLowerCase = votingState.miningKey.toLowerCase()
        if (this.validatorsMetadata.hasOwnProperty(miningKeyLowerCase)) {
          votingState.miningKey = this.validatorsMetadata[miningKeyLowerCase].lastNameAndKey
        }
      }
    } else if (contractType === 'votingToChangeProxy') {
      votingState.contractTypeDisplayName = ballotStore.ProxyBallotType[votingState.contractType]
    }

    return votingState
  }

  getCard = async (id, contractType) => {
    let votingState
    try {
      const data = await Promise.all([
        this[contractType].getBallotInfo(id, this.votingKey),
        this[contractType].instance.methods.getMinThresholdOfVoters(id).call()
      ])
      votingState = this.fillCardVotingState(data[0], contractType)
      votingState.threshold = data[1]
    } catch (e) {
      console.log(e.message)
    }

    let card
    switch (contractType) {
      case 'votingToChangeKeys':
        card = (
          <BallotKeysCard
            id={id}
            type={ballotStore.BallotType.keys}
            key={ballotsStore.ballotCards.length}
            pos={ballotsStore.ballotCards.length}
            votingState={votingState}
          />
        )
        break
      case 'votingToChangeMinThreshold':
        card = (
          <BallotMinThresholdCard
            id={id}
            type={ballotStore.BallotType.minThreshold}
            key={ballotsStore.ballotCards.length}
            pos={ballotsStore.ballotCards.length}
            votingState={votingState}
          />
        )
        break
      case 'votingToChangeProxy':
        card = (
          <BallotProxyCard
            id={id}
            type={ballotStore.BallotType.proxy}
            key={ballotsStore.ballotCards.length}
            pos={ballotsStore.ballotCards.length}
            votingState={votingState}
          />
        )
        break
      case 'votingToManageEmissionFunds':
        card = (
          <BallotEmissionFundsCard
            id={id}
            type={ballotStore.BallotType.emissionFunds}
            key={ballotsStore.ballotCards.length}
            pos={ballotsStore.ballotCards.length}
            votingState={votingState}
          />
        )
        break
      default:
        break
    }

    return card
  }

  getCards = async (nextBallotId, contractType) => {
    for (let id = nextBallotId - 1; id >= 0; id--) {
      ballotsStore.ballotCards.push(await this.getCard(id, contractType))
    }
  }

  @action('Get all keys next ballot ids')
  getAllBallotsNextIDs = async () => {
    const keysNextBallotId = this.votingToChangeKeys.nextBallotId()
    const minThresholdNextBallotId = this.votingToChangeMinThreshold.nextBallotId()
    const proxyNextBallotId = this.votingToChangeProxy.nextBallotId()
    const emissionFundsNextBallotId = this.votingToManageEmissionFunds
      ? this.votingToManageEmissionFunds.nextBallotId()
      : 0
    return Promise.all([keysNextBallotId, minThresholdNextBallotId, proxyNextBallotId, emissionFundsNextBallotId])
  }

  @action
  async getBallotsLimits() {
    return new Promise(async resolve => {
      if (this.web3Instance && this.netId) {
        const limitPerValidator = await this.ballotsStorage.instance.methods.getBallotLimitPerValidator().call()

        const getKeysLimit = await this.votingToChangeKeys.getBallotLimit(this.miningKey, limitPerValidator)
        const getMinThresholdLimit = await this.votingToChangeMinThreshold.getBallotLimit(
          this.miningKey,
          limitPerValidator
        )
        const getProxyLimit = await this.votingToChangeProxy.getBallotLimit(this.miningKey, limitPerValidator)

        const getKeysMinBallotDuration = await this.votingToChangeKeys.minBallotDuration()
        const getMinThresholdMinBallotDuration = await this.votingToChangeMinThreshold.minBallotDuration()
        const getProxyMinBallotDuration = await this.votingToChangeProxy.minBallotDuration()

        await Promise.all([
          getKeysLimit,
          getMinThresholdLimit,
          getProxyLimit,
          getKeysMinBallotDuration,
          getMinThresholdMinBallotDuration,
          getProxyMinBallotDuration
        ]).then(
          ([
            keysLimit,
            minThresholdLimit,
            proxyLimit,
            keysMinBallotDuration,
            minThresholdMinBallotDuration,
            proxyMinBallotDuration
          ]) => {
            this.validatorLimits.keys = keysLimit
            this.validatorLimits.minThreshold = minThresholdLimit
            this.validatorLimits.proxy = proxyLimit
            this.minBallotDuration.keys = keysMinBallotDuration
            this.minBallotDuration.minThreshold = minThresholdMinBallotDuration
            this.minBallotDuration.proxy = proxyMinBallotDuration
            resolve()
          }
        )
      } else {
        resolve()
      }
    })
  }

  @action
  async getAllValidatorMetadata() {
    this.validatorsMetadata[constants.NEW_MINING_KEY.value] = constants.NEW_MINING_KEY
    const keys = await this.poaConsensus.getValidators()
    this.validatorsLength = keys.length
    keys.forEach(async key => {
      const metadata = await this.validatorMetadata.getValidatorFullName(key)
      this.validatorsMetadata[key.toLowerCase()] = {
        label: `${key} ${metadata.lastName}`.trim(),
        lastNameAndKey: `${metadata.lastName} ${key}`.trim(),
        fullName: `${metadata.firstName} ${metadata.lastName}`.trim(),
        value: key
      }
    })
  }
}

const contractsStore = new ContractsStore()

export default contractsStore
export { ContractsStore }
