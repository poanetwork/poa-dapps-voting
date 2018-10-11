import React from 'react'
import { inject, observer } from 'mobx-react'
import moment from 'moment'
import swal from 'sweetalert2'
import { Validator } from './Validator.jsx'
import { KeysTypes } from './KeysTypes.jsx'
import { BallotKeysMetadata } from './BallotKeysMetadata.jsx'
import { BallotMinThresholdMetadata } from './BallotMinThresholdMetadata.jsx'
import { BallotProxyMetadata } from './BallotProxyMetadata.jsx'
import { BallotEmissionFundsMetadata } from './BallotEmissionFundsMetadata.jsx'
import { messages } from '../messages'
import { constants } from '../constants'
import { sendTransactionByVotingKey } from '../helpers'
@inject('commonStore', 'ballotStore', 'validatorStore', 'contractsStore', 'routing', 'ballotsStore')
@observer
export class NewBallot extends React.Component {
  constructor(props) {
    super(props)
    this.onClick = this.onClick.bind(this)
  }

  getStartTimeUnix() {
    return moment
      .utc()
      .add(constants.startTimeOffsetInMinutes, 'minutes')
      .unix()
  }

  checkValidation() {
    const { commonStore, contractsStore, ballotStore, validatorStore } = this.props

    if (ballotStore.isNewValidatorPersonalData) {
      for (let validatorProp in validatorStore) {
        if (validatorStore[validatorProp].length === 0) {
          swal('Warning!', `Validator ${validatorProp} is empty`, 'warning')
          commonStore.hideLoading()
          return false
        }
      }
    }

    if (!ballotStore.memo) {
      swal('Warning!', messages.DESCRIPTION_IS_EMPTY, 'warning')
      commonStore.hideLoading()
      return false
    }

    if (!ballotStore.isBallotForEmissionFunds) {
      const minBallotDurationInHours = constants.minBallotDurationInDays * 24
      const startTime = this.getStartTimeUnix()
      const minEndTime = moment
        .utc()
        .add(minBallotDurationInHours, 'hours')
        .format()
      let neededMinutes = moment(minEndTime).diff(moment(ballotStore.endTime), 'minutes')
      const neededHours = Math.floor(neededMinutes / 60)
      let duration = moment.unix(ballotStore.endTimeUnix).diff(moment.unix(startTime), 'hours')

      if (duration < 0) {
        duration = 0
      }

      if (neededMinutes > 0) {
        neededMinutes = Math.abs(neededHours * 60 - neededMinutes)
        swal(
          'Warning!',
          messages.SHOULD_BE_MORE_THAN_MIN_DURATION(minBallotDurationInHours, duration, neededHours, neededMinutes),
          'warning'
        )
        commonStore.hideLoading()
        return false
      }

      const twoWeeks = moment
        .utc()
        .add(14, 'days')
        .format()
      const exceededMinutes = moment(ballotStore.endTime).diff(moment(twoWeeks), 'minutes')
      if (exceededMinutes > 0) {
        swal('Warning!', messages.SHOULD_BE_LESS_OR_EQUAL_14_DAYS(duration), 'warning')
        commonStore.hideLoading()
        return false
      }
    }

    if (ballotStore.isBallotForKey) {
      for (let ballotKeysProp in ballotStore.ballotKeys) {
        if (ballotKeysProp === 'newVotingKey' || ballotKeysProp === 'newPayoutKey') {
          continue
        }
        if (!ballotStore.ballotKeys[ballotKeysProp]) {
          swal('Warning!', `Ballot ${ballotKeysProp} is empty`, 'warning')
          commonStore.hideLoading()
          return false
        }
        if (ballotStore.ballotKeys[ballotKeysProp].length === 0) {
          swal('Warning!', `Ballot ${ballotKeysProp} is empty`, 'warning')
          commonStore.hideLoading()
          return false
        }
      }

      let isAffectedKeyAddress = contractsStore.web3Instance.utils.isAddress(ballotStore.ballotKeys.affectedKey)

      if (!isAffectedKeyAddress) {
        swal('Warning!', messages.AFFECTED_KEY_IS_NOT_ADDRESS_MSG, 'warning')
        commonStore.hideLoading()
        return false
      }

      let isMiningKeyAddress = contractsStore.web3Instance.utils.isAddress(ballotStore.ballotKeys.miningKey.value)
      if (!isMiningKeyAddress) {
        swal('Warning!', messages.MINING_KEY_IS_NOT_ADDRESS_MSG, 'warning')
        commonStore.hideLoading()
        return false
      }
    }

    if (ballotStore.isBallotForMinThreshold) {
      for (let ballotMinThresholdProp in ballotStore.ballotMinThreshold) {
        if (ballotStore.ballotMinThreshold[ballotMinThresholdProp].length === 0) {
          swal('Warning!', `Ballot ${ballotMinThresholdProp} is empty`, 'warning')
          commonStore.hideLoading()
          return false
        }
      }
    }

    if (ballotStore.isBallotForProxy) {
      for (let ballotProxyProp in ballotStore.ballotProxy) {
        if (ballotStore.ballotProxy[ballotProxyProp].length === 0) {
          swal('Warning!', `Ballot ${ballotProxyProp} is empty`, 'warning')
          commonStore.hideLoading()
          return false
        }
      }

      const isAddress = contractsStore.web3Instance.utils.isAddress(ballotStore.ballotProxy.proposedAddress)

      if (!isAddress) {
        swal('Warning!', messages.PROPOSED_ADDRESS_IS_NOT_ADDRESS_MSG, 'warning')
        commonStore.hideLoading()
        return false
      }
    }

    if (ballotStore.isBallotForEmissionFunds) {
      if (ballotStore.ballotEmissionFunds.receiver.length === 0) {
        swal('Warning!', `Address of funds receiver is empty`, 'warning')
        commonStore.hideLoading()
        return false
      }

      const isAddress = contractsStore.web3Instance.utils.isAddress(ballotStore.ballotEmissionFunds.receiver)

      if (!isAddress) {
        swal('Warning!', messages.PROPOSED_ADDRESS_IS_NOT_ADDRESS_MSG, 'warning')
        commonStore.hideLoading()
        return false
      }
    }

    if (
      !ballotStore.isBallotForKey &&
      !ballotStore.isBallotForMinThreshold &&
      !ballotStore.isBallotForProxy &&
      !ballotStore.isBallotForEmissionFunds
    ) {
      swal('Warning!', messages.BALLOT_TYPE_IS_EMPTY_MSG, 'warning')
      commonStore.hideLoading()
      return false
    }

    return true
  }

  createBallotForKeys = (startTime, endTime) => {
    const { ballotStore, contractsStore } = this.props
    const inputToMethod = {
      startTime,
      endTime,
      affectedKey: ballotStore.ballotKeys.affectedKey,
      affectedKeyType: ballotStore.ballotKeys.keyType,
      newVotingKey: ballotStore.ballotKeys.newVotingKey,
      newPayoutKey: ballotStore.ballotKeys.newPayoutKey,
      miningKey: ballotStore.ballotKeys.miningKey.value,
      ballotType: ballotStore.ballotKeys.keysBallotType,
      memo: ballotStore.memo
    }
    let data
    if (
      inputToMethod.ballotType === ballotStore.KeysBallotType.add &&
      inputToMethod.affectedKeyType === ballotStore.KeyType.mining &&
      (inputToMethod.newVotingKey || inputToMethod.newPayoutKey)
    ) {
      data = contractsStore.votingToChangeKeys.createBallotToAddNewValidator(inputToMethod)
    } else {
      data = contractsStore.votingToChangeKeys.createBallot(inputToMethod)
    }
    return data
  }

  createBallotForMinThreshold = (startTime, endTime) => {
    const { ballotStore, contractsStore } = this.props
    const inputToMethod = {
      startTime,
      endTime,
      proposedValue: ballotStore.ballotMinThreshold.proposedValue,
      memo: ballotStore.memo
    }
    return contractsStore.votingToChangeMinThreshold.createBallot(inputToMethod)
  }

  createBallotForProxy = (startTime, endTime) => {
    const { ballotStore, contractsStore } = this.props
    const inputToMethod = {
      startTime,
      endTime,
      proposedValue: ballotStore.ballotProxy.proposedAddress,
      contractType: ballotStore.ballotProxy.contractType,
      memo: ballotStore.memo
    }
    return contractsStore.votingToChangeProxy.createBallot(inputToMethod)
  }

  createBallotForEmissionFunds = (startTime, endTime) => {
    const { ballotStore, contractsStore } = this.props
    const inputToMethod = {
      startTime,
      endTime,
      receiver: ballotStore.ballotEmissionFunds.receiver,
      memo: ballotStore.memo
    }
    return contractsStore.votingToManageEmissionFunds.createBallot(inputToMethod)
  }

  onClick = async () => {
    const { commonStore, contractsStore, ballotStore, ballotsStore } = this.props
    const { push } = this.props.routing
    commonStore.showLoading()
    const isValidVotingKey = contractsStore.isValidVotingKey
    if (!isValidVotingKey) {
      commonStore.hideLoading()
      swal('Warning!', messages.invalidVotingKeyMsg(contractsStore.votingKey), 'warning')
      return
    }
    const isFormValid = this.checkValidation()
    if (isFormValid) {
      if (ballotStore.ballotType === ballotStore.BallotType.keys) {
        const inputToAreBallotParamsValid = {
          affectedKey: ballotStore.ballotKeys.affectedKey,
          affectedKeyType: ballotStore.ballotKeys.keyType,
          miningKey: ballotStore.ballotKeys.miningKey.value,
          ballotType: ballotStore.ballotKeys.keysBallotType
        }
        let areBallotParamsValid
        areBallotParamsValid = await contractsStore.ballotsStorage.areKeysBallotParamsValid(inputToAreBallotParamsValid)
        if (areBallotParamsValid === null) {
          areBallotParamsValid = await contractsStore.votingToChangeKeys.areBallotParamsValid(
            inputToAreBallotParamsValid
          )
        }
        if (ballotStore.ballotKeys.keysBallotType === ballotStore.KeysBallotType.add) {
          if (ballotStore.ballotKeys.keyType !== ballotStore.KeyType.mining) {
            if (!ballotStore.ballotKeys.miningKey.value) {
              areBallotParamsValid = false
            } else if (ballotStore.ballotKeys.miningKey.value === '0x0000000000000000000000000000000000000000') {
              areBallotParamsValid = false
            }
          }
        }
        if (!areBallotParamsValid) {
          commonStore.hideLoading()
          return swal('Warning!', 'The ballot input params are invalid', 'warning')
        }
      }

      let startTime = this.getStartTimeUnix()
      let endTime = ballotStore.endTimeUnix

      if (ballotStore.ballotType === ballotStore.BallotType.emissionFunds) {
        const votingContract = contractsStore.votingToManageEmissionFunds

        let emissionReleaseTime = Number(await votingContract.emissionReleaseTime())
        const emissionReleaseThreshold = Number(await votingContract.emissionReleaseThreshold())
        const currentTime = Number(await votingContract.getTime())
        emissionReleaseTime = votingContract.refreshEmissionReleaseTime(
          emissionReleaseTime,
          emissionReleaseThreshold,
          currentTime
        )

        if (currentTime < emissionReleaseTime) {
          commonStore.hideLoading()
          const emissionReleaseTimeString = moment
            .unix(emissionReleaseTime)
            .utc()
            .format('MMM Do YYYY, h:mm:ss a')
          swal('Warning!', messages.EMISSION_RELEASE_TIME_IN_FUTURE(emissionReleaseTimeString), 'warning')
          return
        }

        const noActiveBallotExists = await votingContract.noActiveBallotExists()
        if (!noActiveBallotExists) {
          commonStore.hideLoading()
          swal('Warning!', messages.PREVIOUS_BALLOT_NOT_FINALIZED, 'warning')
          return
        }

        const distributionThreshold = Number(await votingContract.distributionThreshold())

        startTime = currentTime + constants.startTimeOffsetInMinutes * 60
        endTime = emissionReleaseTime + distributionThreshold
      }

      let methodToCreateBallot
      let contractType
      let contractInstance
      switch (ballotStore.ballotType) {
        case ballotStore.BallotType.keys:
          methodToCreateBallot = this.createBallotForKeys
          contractType = 'votingToChangeKeys'
          contractInstance = contractsStore.votingToChangeKeys.instance
          break
        case ballotStore.BallotType.minThreshold:
          methodToCreateBallot = this.createBallotForMinThreshold
          contractType = 'votingToChangeMinThreshold'
          contractInstance = contractsStore.votingToChangeMinThreshold.instance
          break
        case ballotStore.BallotType.proxy:
          methodToCreateBallot = this.createBallotForProxy
          contractType = 'votingToChangeProxy'
          contractInstance = contractsStore.votingToChangeProxy.instance
          break
        case ballotStore.BallotType.emissionFunds:
          methodToCreateBallot = this.createBallotForEmissionFunds
          contractType = 'votingToManageEmissionFunds'
          contractInstance = contractsStore.votingToManageEmissionFunds.instance
          break
        default:
          break
      }

      sendTransactionByVotingKey(
        this.props,
        contractInstance.options.address,
        methodToCreateBallot(startTime, endTime),
        async tx => {
          const events = await contractInstance.getPastEvents('BallotCreated', {
            fromBlock: tx.blockNumber,
            toBlock: tx.blockNumber
          })
          const newId = Number(events[0].returnValues.id)
          const card = await contractsStore.getCard(newId, contractType)
          ballotsStore.ballotCards.push(card)

          swal('Congratulations!', messages.BALLOT_CREATED_SUCCESS_MSG, 'success').then(result => {
            push(`${commonStore.rootPath}`)
            window.scrollTo(0, 0)
          })
        },
        messages.BALLOT_CREATE_FAILED_TX
      )
    }
  }

  menuItemActive = ballotType => {
    const { ballotStore } = this.props

    if (ballotType == ballotStore.ballotType) {
      return 'ballot-types-i ballot-types-i_active'
    } else {
      return 'ballot-types-i'
    }
  }

  componentDidMount() {
    const { ballotStore } = this.props
    ballotStore.changeBallotType(null, ballotStore.BallotType.keys)
  }

  render() {
    const { contractsStore, ballotStore } = this.props
    let validator = ballotStore.isNewValidatorPersonalData ? <Validator /> : ''
    let keysTypes = ballotStore.isBallotForKey ? <KeysTypes /> : ''
    let metadata
    let minThreshold = 0
    switch (ballotStore.ballotType) {
      case ballotStore.BallotType.keys:
        metadata = <BallotKeysMetadata />
        minThreshold = contractsStore.keysBallotThreshold
        break
      case ballotStore.BallotType.minThreshold:
        metadata = <BallotMinThresholdMetadata />
        minThreshold = contractsStore.minThresholdBallotThreshold
        break
      case ballotStore.BallotType.proxy:
        metadata = <BallotProxyMetadata />
        minThreshold = contractsStore.proxyBallotThreshold
        break
      case ballotStore.BallotType.emissionFunds:
        metadata = <BallotEmissionFundsMetadata />
        minThreshold = contractsStore.emissionFundsBallotThreshold
        break
      default:
        break
    }
    const emissionFundsManagementBallot = contractsStore.votingToManageEmissionFunds ? (
      <div
        className={this.menuItemActive(ballotStore.BallotType.emissionFunds)}
        onClick={e => ballotStore.changeBallotType(e, ballotStore.BallotType.emissionFunds)}
      >
        Emission Funds Ballot
      </div>
    ) : (
      ''
    )
    return (
      <section className="container new">
        <form action="" className="new-form">
          <div className="new-form-side new-form-side_left">
            <div className="ballot-types">
              <div
                className={this.menuItemActive(ballotStore.BallotType.keys)}
                onClick={e => ballotStore.changeBallotType(e, ballotStore.BallotType.keys)}
              >
                Validator Management Ballot
              </div>
              <div
                className={this.menuItemActive(ballotStore.BallotType.minThreshold)}
                onClick={e => ballotStore.changeBallotType(e, ballotStore.BallotType.minThreshold)}
              >
                Consensus Threshold Ballot
              </div>
              <div
                className={this.menuItemActive(ballotStore.BallotType.proxy)}
                onClick={e => ballotStore.changeBallotType(e, ballotStore.BallotType.proxy)}
              >
                Modify Proxy Contract Ballot
              </div>
              {emissionFundsManagementBallot}
            </div>
            <div className="info">
              <p className="info-title">Limits of the ballot</p>
              <div className="info-i">
                Minimum {minThreshold} from {contractsStore.validatorsLength} validators are required to pass the&nbsp;
                proposal<br />
              </div>
              <div className="info-i">
                You can create {contractsStore.validatorLimits.keys} ballot(s) for keys<br />
              </div>
              <div className="info-i">
                You can create {contractsStore.validatorLimits.minThreshold} ballot(s) for consensus<br />
              </div>
              <div className="info-i">
                You can create {contractsStore.validatorLimits.proxy} ballot(s) for proxy<br />
              </div>
            </div>
          </div>
          <div className="new-form-side new-form-side_right">
            <div className="form-el">
              <label>Description of the ballot</label>
              <div>
                <textarea rows="4" value={ballotStore.memo} onChange={e => ballotStore.setMemo(e)} />
              </div>
            </div>
            <hr />
            {keysTypes}
            {validator}
            {metadata}
            <button type="button" className="btn btn-primary btn-new text-capitalize" onClick={e => this.onClick(e)}>
              Add ballot
            </button>
          </div>
        </form>
      </section>
    )
  }
}
