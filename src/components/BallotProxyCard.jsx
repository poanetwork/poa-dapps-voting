import React from "react";
import { observable, action } from "mobx";
import { inject, observer } from "mobx-react";
import { BallotCard } from "./BallotCard";

@inject("commonStore", "contractsStore", "ballotStore", "routing")
@observer
export class BallotProxyCard extends React.Component {
  @observable proposedAddress;
  @observable contractType;

  @action("Get proposed address of proxy ballot")
  getProposedAddress = async () => {
    const { contractsStore, id } = this.props;
    let proposedAddress;
    try {
      proposedAddress = await contractsStore.votingToChangeProxy.getProposedValue(id);
    } catch(e) {
      console.log(e.message);
    }
    this.proposedAddress = proposedAddress;
  }

  @action("Get contract type of proxy ballot")
  getContractType = async () => {
    const { contractsStore, id } = this.props;
    let contractType;
    try { 
      contractType = await contractsStore.votingToChangeProxy.getContractType(id);
    } catch(e) {
      console.log(e.message);
    }
    this.contractType = contractType;
  }

  constructor(props) {
    super(props);
    this.getProposedAddress();
    this.getContractType();
  }

  isSearchPattern = () => {
    let { commonStore } = this.props;
    if (commonStore.searchTerm) {
      const isProposedAddressPattern = String(this.proposedAddress).toLowerCase().includes(commonStore.searchTerm);
      const isContractTypePattern = String(this.contractType).toLowerCase().includes(commonStore.searchTerm);
      return (isProposedAddressPattern || isContractTypePattern);
    }
    return true;
  }

  render () {
    const { ballotStore, id } = this.props;
    return (
      <BallotCard votingType="votingToChangeProxy" id={id} isSearchPattern={this.isSearchPattern()}>
        <div className="ballots-about-i ballots-about-i_contract-type">
            <div className="ballots-about-td">
              <p className="ballots-about-i--title">Contract type</p>
            </div>
            <div className="ballots-about-td">
              <p>{ballotStore.ProxyBallotType[this.contractType]}</p>
            </div>
          </div>
          <div className="ballots-about-i ballots-about-i_proposed-address">
            <div className="ballots-about-td">
              <p className="ballots-about-i--title">Proposed contract address</p>
            </div>
            <div className="ballots-about-td">
              <p>{this.proposedAddress}</p>
            </div>
          </div>
      </BallotCard>
    );
  }
}
