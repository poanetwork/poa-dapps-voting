import React from 'react';
import { inject, observer } from "mobx-react";
import moment from 'moment';
import swal from 'sweetalert2';
import { Validator } from './Validator';
import { KeysTypes } from './KeysTypes';
import { BallotKeysMetadata } from './BallotKeysMetadata';
import { BallotMinThresholdMetadata } from './BallotMinThresholdMetadata';
import { BallotProxyMetadata } from './BallotProxyMetadata';

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
      swal("Warning!", "Ballot end time should be greater than now", "warning");
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
        swal("Warning!", `Ballot affectedKey isn't address`, "warning");
        commonStore.hideLoading();
        return false;
      }

      let isMiningKeyAddress = contractsStore.web3Instance.isAddress(ballotStore.ballotKeys.miningKey);

      if (!isMiningKeyAddress) {
        swal("Warning!", `Ballot miningKey isn't address`, "warning");
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
        swal("Warning!", `Ballot proposedAddress isn't address`, "warning");
        commonStore.hideLoading();
        return false;
      }
    }

    return true;
  }

  createBallotForKeys = (curDateInSeconds) => {
    const { ballotStore, contractsStore } = this.props;
    const inputToMethod = [
      curDateInSeconds,
      ballotStore.endTimeUnix,
      ballotStore.ballotKeys.affectedKey, 
      ballotStore.ballotKeys.keyType, 
      ballotStore.ballotKeys.miningKey,
      ballotStore.ballotType,
      contractsStore.votingKey
    ];
    console.log(inputToMethod)
    let method = contractsStore.votingToChangeKeys.createVotingForKeys(
      ...inputToMethod
    );
    return method;
  }

  createBallotForMinThreshold = (curDateInSeconds) => {
    const { ballotStore, contractsStore } = this.props;
    const inputToMethod = [
      curDateInSeconds,
      ballotStore.endTimeUnix,
      ballotStore.ballotMinThreshold.proposedValue, 
      contractsStore.votingKey
    ];
    console.log(inputToMethod)
    let method = contractsStore.votingToChangeMinThreshold.createBallotToChangeThreshold(
      ...inputToMethod
    );
    return method;
  }

  createBallotForProxy = (curDateInSeconds) => {
    const { ballotStore, contractsStore } = this.props;
    const inputToMethod = [
      curDateInSeconds,
      ballotStore.endTimeUnix,
      ballotStore.ballotProxy.proposedAddress, 
      ballotStore.ballotProxy.contractType,
      contractsStore.votingKey
    ];
    let method = contractsStore.votingToChangeProxy.createBallotToChangeProxyAddress(
      ...inputToMethod
    );
    return method;
  }

  onClick = async () => {
    const { commonStore, contractsStore, ballotStore } = this.props;
    const { push } = this.props.routing;
    commonStore.showLoading();
    const isValidVotingKey = contractsStore.isValidVotingKey;
    if (!isValidVotingKey) {
      commonStore.hideLoading();
      swal("Warning!", "The key is not valid voting Key! Please make sure you have loaded correct voting key in metamask", "warning");
      return;
    }
    const isFormValid = this.checkValidation();
    if (isFormValid) {
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
        swal("Congratulations!", "You successfully created a new ballot", "success").then((result) => {
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
    let minThreshold
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
                <label htmlFor="ballot-for-validators" className="radio">Ballot for validators</label>
                <p className="hint">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                  eiusmod tempor incididunt ut labore
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
                <label htmlFor="ballot-for-consensus" className="radio">Ballot for consensus</label>
                <p className="hint">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                  eiusmod tempor incididunt ut labore
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
                <label htmlFor="ballot-for-proxy" className="radio">Ballot for proxy</label>
                <p className="hint">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                  eiusmod tempor incididunt ut labore
                </p>
              </div>
            </div>
          </div>
          <hr />
          {validator}
          {keysTypes}
          {metadata}
          <div className="new-form-footer">
            <div className="info">
              Minimum {minThreshold} from {contractsStore.validatorsLength} validators  required to pass the proposal
            </div>
            <button type="button" className="add-ballot" onClick={e => this.onClick(e)}>Add ballot</button>
          </div>
        </form>
      </section>
    );
  }
}
