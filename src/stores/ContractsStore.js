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
    this.votingKey = '0x0000000000000000000000000000000000000000'
    this.miningKey = '0x0000000000000000000000000000000000000000'
    this.validatorsMetadata = {}
    this.validatorLimits = { keys: null, minThreshold: null, proxy: null }
    this.minBallotDuration = { keys: 0, minThreshold: 0, proxy: 0 }
    this.injectedWeb3 = false
  }

  @computed
  get isEmptyVotingKey() {
    return !this.votingKey || this.votingKey === '0x0000000000000000000000000000000000000000'
  }

  @computed
  get isValidVotingKey() {
    if (this.isEmptyVotingKey) return false
    if (this.miningKey && this.miningKey !== '0x0000000000000000000000000000000000000000') return true
    return false
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
    let miningKey = '0x0000000000000000000000000000000000000000'
    if (account && account !== '0x0000000000000000000000000000000000000000') {
      try {
        miningKey = await this.keysManager.instance.methods.miningKeyByVoting(account).call()
      } catch (e) {
        console.log(e)
      }
    }
    this.miningKey = miningKey
  }

  @action('Update keys')
  updateKeys = async account => {
    account = account || '0x0000000000000000000000000000000000000000'

    if (this.votingKey && this.votingKey.toLowerCase() === account.toLowerCase()) {
      return
    }

    this.setVotingKey(account)
    await this.setMiningKey(account)

    console.log('votingKey', this.votingKey)
    console.log('miningKey', this.miningKey)

    await this.getBallotsLimits()
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

    const [keysBallots, minThresholdBallots, proxyBallots, emissionFundsBallots] = await Promise.all([
      this.getBallots(keysNextBallotId, 'votingToChangeKeys'),
      this.getBallots(minThresholdNextBallotId, 'votingToChangeMinThreshold'),
      this.getBallots(proxyNextBallotId, 'votingToChangeProxy'),
      this.getBallots(emissionFundsNextBallotId, 'votingToManageEmissionFunds')
    ])

    const ballots = [...keysBallots, ...minThresholdBallots, ...proxyBallots, ...emissionFundsBallots]
    ballotsStore.ballotCards = this.mapBallotsToCards(ballots)

    const finalizedOrCancelled = item => item.isFinalized || item.isCanceled
    window.localStorage.setItem(
      `ballots-${this.netId}`,
      JSON.stringify({
        votingToChangeKeys: keysBallots.filter(finalizedOrCancelled),
        votingToChangeMinThreshold: minThresholdBallots.filter(finalizedOrCancelled),
        votingToChangeProxy: proxyBallots.filter(finalizedOrCancelled),
        votingToManageEmissionFunds: emissionFundsBallots.filter(finalizedOrCancelled)
      })
    )

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

  mapBallotsToCards = ballots => {
    return ballots.map((ballot, pos) => {
      let component
      let params = {
        id: ballot.id,
        key: ballot.type + ballot.id,
        pos,
        votingState: ballot
      }
      switch (ballot.type) {
        case 'votingToChangeKeys':
          component = <BallotKeysCard {...params} type={ballotStore.BallotType.keys} />
          break
        case 'votingToChangeMinThreshold':
          component = <BallotMinThresholdCard {...params} type={ballotStore.BallotType.minThreshold} />
          break
        case 'votingToChangeProxy':
          component = <BallotProxyCard {...params} type={ballotStore.BallotType.proxy} />
          break
        case 'votingToManageEmissionFunds':
          component = <BallotEmissionFundsCard {...params} type={ballotStore.BallotType.emissionFunds} />
          break
        default:
          break
      }
      return component
    })
  }

  getBallot = async (id, contractType) => {
    let votingState
    try {
      votingState = await this[contractType].getBallotInfo(id, this.votingKey)
      votingState = this.fillCardVotingState(votingState, contractType)
      votingState.type = contractType
      votingState.id = id
    } catch (e) {
      console.log(e.message)
    }
    return votingState
  }

  getBallots = async (nextBallotId, contractType) => {
    const ballotsObject = JSON.parse(window.localStorage.getItem(`ballots-${this.netId}`) || '{}')
    const existingBallots = ballotsObject[contractType] || []
    const existingBallotsIds = existingBallots.map(item => item.id)
    const allBallotsIds = Array(nextBallotId)
      .fill(undefined)
      .map((item, index) => index)
    const newBallotsIds = allBallotsIds.filter(item => !existingBallotsIds.includes(item))
    const promises = newBallotsIds.map(id => this.getBallot(id, contractType))
    const newBallots = await Promise.all(promises)
    return existingBallots.concat(newBallots)
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
        let keysLimit = 0
        let minThresholdLimit = 0
        let proxyLimit = 0

        if (this.isValidVotingKey) {
          const limitPerValidator = await this.ballotsStorage.instance.methods.getBallotLimitPerValidator().call()
          keysLimit = await this.votingToChangeKeys.getBallotLimit(this.miningKey, limitPerValidator)
          minThresholdLimit = await this.votingToChangeMinThreshold.getBallotLimit(this.miningKey, limitPerValidator)
          proxyLimit = await this.votingToChangeProxy.getBallotLimit(this.miningKey, limitPerValidator)
        }

        this.validatorLimits.keys = keysLimit
        this.validatorLimits.minThreshold = minThresholdLimit
        this.validatorLimits.proxy = proxyLimit
      }
      resolve()
    })
  }

  @action
  async getMinBallotDurationsAndThresholds() {
    return new Promise(async resolve => {
      if (this.web3Instance && this.netId) {
        const getKeysMinBallotDuration = this.votingToChangeKeys.minBallotDuration()
        const getMinThresholdMinBallotDuration = this.votingToChangeMinThreshold.minBallotDuration()
        const getProxyMinBallotDuration = this.votingToChangeProxy.minBallotDuration()

        const getBallotThreshold = this.ballotsStorage.instance.methods.getBallotThreshold(1).call()
        const getProxyThreshold = this.ballotsStorage.instance.methods.getProxyThreshold().call()
        const getBallotCancelingThreshold = this.votingToManageEmissionFunds
          ? this.votingToManageEmissionFunds.ballotCancelingThreshold()
          : 0

        await Promise.all([
          getKeysMinBallotDuration,
          getMinThresholdMinBallotDuration,
          getProxyMinBallotDuration,
          getBallotThreshold,
          getProxyThreshold,
          getBallotCancelingThreshold
        ]).then(
          ([
            keysMinBallotDuration,
            minThresholdMinBallotDuration,
            proxyMinBallotDuration,
            keysBallotThreshold,
            proxyBallotThreshold,
            cancelingThreshold
          ]) => {
            this.minBallotDuration.keys = keysMinBallotDuration
            this.minBallotDuration.minThreshold = minThresholdMinBallotDuration
            this.minBallotDuration.proxy = proxyMinBallotDuration
            this.keysBallotThreshold = keysBallotThreshold
            this.minThresholdBallotThreshold = keysBallotThreshold
            this.proxyBallotThreshold = proxyBallotThreshold
            this.emissionFundsBallotThreshold = proxyBallotThreshold
            this.ballotCancelingThreshold = cancelingThreshold
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
