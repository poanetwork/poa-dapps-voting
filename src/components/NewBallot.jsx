import React from 'react';
import { inject, observer } from "mobx-react";
import moment from 'moment';
import swal from 'sweetalert2';
import { Validator } from './Validator';
import { KeysTypes } from './KeysTypes';
import { BallotKeysMetadata } from './BallotKeysMetadata';
import { BallotMinThresholdMetadata } from './BallotMinThresholdMetadata';
import { BallotProxyMetadata } from './BallotProxyMetadata';
import { messages } from "../messages";

@inject("commonStore", "ballotStore", "validatorStore", "contractsStore", "routing")
@observer
export class NewBallot extends React.Component {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }

  checkValidation() {
    const { commonStore, contractsStore, ballotStore, validatorStore } = this.props;
    const isAfter = moment(ballotStore.endTime).isAfter(moment());

    if (ballotStore.isNewValidatorPersonalData) {
      for (let validatorProp in validatorStore) {
        if (validatorStore[validatorProp].length === 0) {
          swal("Warning!", `Validator ${validatorProp} is empty`, "warning");
          commonStore.hideLoading();
          return false;
        }
      }
    }

    if (!isAfter) {
      swal("Warning!", messages.END_TIME_SHOULD_BE_GREATER_THAN_NOW_MSG, "warning");
      commonStore.hideLoading();
      return false;
    }

    if (ballotStore.isBallotForKey) {
      for (let ballotKeysProp in ballotStore.ballotKeys) {
        if (ballotStore.ballotKeys[ballotKeysProp].length === 0) {
          swal("Warning!", `Ballot ${ballotKeysProp} is empty`, "warning");
          commonStore.hideLoading();
          return false;
        }
      }

      let isAffectedKeyAddress = contractsStore.web3Instance.isAddress(ballotStore.ballotKeys.affectedKey);

      if (!isAffectedKeyAddress) {
        swal("Warning!", messages.AFFECTED_KEY_IS_NOT_ADDRESS_MSG, "warning");
        commonStore.hideLoading();
        return false;
      }

      let isMiningKeyAddress = contractsStore.web3Instance.isAddress(ballotStore.ballotKeys.miningKey.value);
      if (!isMiningKeyAddress) {
        swal("Warning!", messages.MINING_KEY_IS_NOT_ADDRESS_MSG, "warning");
        commonStore.hideLoading();
        return false;
      }
    }

    if (ballotStore.isBallotForMinThreshold) {
      for (let ballotMinThresholdProp in ballotStore.ballotMinThreshold) {
        if (ballotStore.ballotMinThreshold[ballotMinThresholdProp].length === 0) {
          swal("Warning!", `Ballot ${ballotMinThresholdProp} is empty`, "warning");
          commonStore.hideLoading();
          return false;
        }
      }
    }

    if (ballotStore.isBallotForProxy) {
      for (let ballotProxyProp in ballotStore.ballotProxy) {
        if (ballotStore.ballotProxy[ballotProxyProp].length === 0) {
          swal("Warning!", `Ballot ${ballotProxyProp} is empty`, "warning");
          commonStore.hideLoading();
          return false;
        }
      }

      let isAddress = contractsStore.web3Instance.isAddress(ballotStore.ballotProxy.proposedAddress);

      if (!isAddress) {
        swal("Warning!", messages.PROPOSED_ADDRESS_IS_NOT_ADDRESS_MSG, "warning");
        commonStore.hideLoading();
        return false;
      }
    }

    return true;
  }

  createBallotForKeys = (curDateInSeconds) => {
    const { ballotStore, contractsStore } = this.props;
    const inputToMethod = {
      startTime: curDateInSeconds,
      endTime: ballotStore.endTimeUnix,
      affectedKey: ballotStore.ballotKeys.affectedKey, 
      affectedKeyType: ballotStore.ballotKeys.keyType, 
      miningKey: ballotStore.ballotKeys.miningKey.value,
      ballotType: ballotStore.ballotKeys.keysBallotType,
      sender: contractsStore.votingKey,
      memo: ballotStore.memo
    };
    let method = contractsStore.votingToChangeKeys.createVotingForKeys(inputToMethod);
    return method;
  }

  createBallotForMinThreshold = (curDateInSeconds) => {
    const { ballotStore, contractsStore } = this.props;
    const inputToMethod = {
      startTime: curDateInSeconds,
      endTime: ballotStore.endTimeUnix,
      proposedValue: ballotStore.ballotMinThreshold.proposedValue, 
      sender: contractsStore.votingKey,
      memo: ballotStore.memo
    };
    let method = contractsStore.votingToChangeMinThreshold.createBallotToChangeThreshold(inputToMethod);
    return method;
  }

  createBallotForProxy = (curDateInSeconds) => {
    const { ballotStore, contractsStore } = this.props;
    const inputToMethod = {
      startTime: curDateInSeconds,
      endTime: ballotStore.endTimeUnix,
      proposedValue: ballotStore.ballotProxy.proposedAddress, 
      contractType: ballotStore.ballotProxy.contractType,
      sender: contractsStore.votingKey,
      memo: ballotStore.memo
    };
    let method = contractsStore.votingToChangeProxy.createBallotToChangeProxyAddress(inputToMethod);
    return method;
  }

  onClick = async () => {
    const { commonStore, contractsStore, ballotStore } = this.props;
    const { push } = this.props.routing;
    commonStore.showLoading();
    const isValidVotingKey = contractsStore.isValidVotingKey;
    if (!isValidVotingKey) {
      commonStore.hideLoading();
      swal("Warning!", messages.invalidVotingKeyMsg(contractsStore.votingKey), "warning");
      return;
    }
    const isFormValid = this.checkValidation();
    if (isFormValid) {
      if (ballotStore.ballotType === ballotStore.BallotType.keys) {
        const inputToAreBallotParamsValid = {
          affectedKey: ballotStore.ballotKeys.affectedKey, 
          affectedKeyType: ballotStore.ballotKeys.keyType, 
          miningKey: ballotStore.ballotKeys.miningKey.value,
          ballotType: ballotStore.ballotKeys.keysBallotType
        };
        let areBallotParamsValid = await contractsStore.votingToChangeKeys.areBallotParamsValid(inputToAreBallotParamsValid);
        if (!areBallotParamsValid) {
          commonStore.hideLoading();
          return swal("Warning!", "The ballot input params are invalid", "warning");
        }
      }

      let methodToCreateBallot;
      switch (ballotStore.ballotType) {
        case ballotStore.BallotType.keys: 
          methodToCreateBallot = this.createBallotForKeys;
          break;
        case ballotStore.BallotType.minThreshold: 
          methodToCreateBallot = this.createBallotForMinThreshold;
          break;
        case ballotStore.BallotType.proxy: 
          methodToCreateBallot = this.createBallotForProxy;
          break;
        default:
          break;
      }
      const curDate = new Date();
      let curDateInSeconds = moment(curDate).add(5, 'minute').unix();
      methodToCreateBallot(curDateInSeconds)
      .on("receipt", () => {
        commonStore.hideLoading();
        swal("Congratulations!", messages.BALLOT_CREATED_SUCCESS_MSG, "success").then((result) => {
          push(`${commonStore.rootPath}`);
        });
      })
      .on("error", (e) => {
        commonStore.hideLoading();
        swal("Error!", e.message, "error");
      });
    }
  }

  render() {
    const { contractsStore, ballotStore } = this.props;
    let validator = ballotStore.isNewValidatorPersonalData ? <Validator />: "";
    let keysTypes = ballotStore.isBallotForKey ? <KeysTypes />: "";
    let metadata
    let minThreshold = 0;
    switch (ballotStore.ballotType) {
      case ballotStore.BallotType.keys: 
        metadata = <BallotKeysMetadata />;
        minThreshold = contractsStore.keysBallotThreshold;
        break;
      case ballotStore.BallotType.minThreshold: 
        metadata = <BallotMinThresholdMetadata />;
        minThreshold = contractsStore.minThresholdBallotThreshold;
        break;
      case ballotStore.BallotType.proxy: 
        metadata = <BallotProxyMetadata />;
        minThreshold = contractsStore.proxyBallotThreshold;
        break;
      default:
        break;
    }
    return (
      <section className="container new">
        <h1 className="title">New Ballot</h1>
        <form action="" className="new-form">
          <div className="hidden">
            <div className="left">
              <div className="radio-container">
                <input type="radio" name="ballot-type" id="ballot-for-validators" 
                  value={ballotStore.BallotType.keys}
                  checked={ballotStore.isBallotForKey} 
                  onChange={e => ballotStore.changeBallotType(e, ballotStore.BallotType.keys)}
                />
                <label htmlFor="ballot-for-validators" className="radio">Validator Management Ballot</label>
                <p className="hint">
                  Ballot to add, remove or swap any type of key for existing or new validators.
                </p>
              </div>
            </div>
            <div className="right">
              <div className="radio-container">
                <input type="radio" name="ballot-type" id="ballot-for-consensus" 
                  value={ballotStore.BallotType.minThreshold}
                  checked={ballotStore.isBallotForMinThreshold} 
                  onChange={e => ballotStore.changeBallotType(e, ballotStore.BallotType.minThreshold)}
                />
                <label htmlFor="ballot-for-consensus" className="radio">Consenus Threshold Ballot</label>
                <p className="hint">
                  Ballot to change the minimum threshold for consensus to vote for keys.
                </p>
              </div>
            </div>
            <div className="left">
              <div className="radio-container">
                <input type="radio" name="ballot-type" id="ballot-for-proxy" 
                  value={ballotStore.BallotType.proxy}
                  checked={ballotStore.isBallotForProxy} 
                  onChange={e => ballotStore.changeBallotType(e, ballotStore.BallotType.proxy)}
                />
                <label htmlFor="ballot-for-proxy" className="radio">Modify Proxy Contract Ballot</label>
                <p className="hint">
                  Ballot to change one of the proxy contracts.
                </p>
              </div>
            </div>
          </div>
          <hr />
          {validator}
          {keysTypes}
          {metadata}
          <div className="form-el">
            <label>Description of the ballot</label>
            <div>
              <textarea rows="4" 
                value={ballotStore.memo}
                onChange={(e) => ballotStore.setMemo(e)}
                 ></textarea>
            </div>
          </div>
          <div className="new-form-footer">
            <div className="info">
              Minimum {minThreshold} from {contractsStore.validatorsLength} validators  required to pass the proposal<br />
              You can create {contractsStore.validatorLimits.keys} ballot for keys<br />
              You can create {contractsStore.validatorLimits.minThreshold} ballot for consensus<br />
              You can create {contractsStore.validatorLimits.proxy} ballot for proxy<br />
            </div>
            <button type="button" className="add-ballot" onClick={e => this.onClick(e)}>Add ballot</button>
          </div>
        </form>
      </section>
    );
  }
}
