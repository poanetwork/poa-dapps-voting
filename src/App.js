import React, { Component } from 'react'
import swal from 'sweetalert2'
import { Header, Ballots, NewBallot, Settings, Footer, Loading, BaseLoader, SearchBar, MainTitle } from './components'
import { Route } from 'react-router-dom'
import { constants } from './utils/constants'
import { inject, observer } from 'mobx-react'
import { messages } from './utils/messages'
import { getNetworkBranch } from './utils/utils'

import './assets/stylesheets/index.css'

@inject('commonStore', 'contractsStore')
@observer
class App extends Component {
  constructor(props) {
    super(props)

    const { commonStore } = this.props

    this.state = {
      showMobileMenu: false,
      navigationData: [
        {
          icon: 'link-icon-all',
          title: 'All',
          url: commonStore.rootPath,
          class: ''
        },
        {
          icon: 'link-icon-active',
          title: 'Active',
          url: `${commonStore.rootPath}/active`,
          class: ''
        },
        {
          icon: 'link-icon-to-finalize',
          title: 'To Finalize',
          url: `${commonStore.rootPath}/tofinalize`,
          class: ''
        },
        {
          icon: 'link-icon-add',
          title: 'New Ballot',
          url: `${commonStore.rootPath}/new`,
          class: 'btn btn-new-ballot btn-success btn-new no-shadow text-capitalize'
        }
      ]
    }
  }

  getVotingNetworkBranch = () => {
    const { contractsStore } = this.props

    return contractsStore.netId ? getNetworkBranch(contractsStore.netId) : null
  }

  onBallotsRender = () => {
    return <Ballots isActiveFilter={false} />
  }

  onActiveBallotsRender = () => {
    return <Ballots isActiveFilter={true} />
  }

  onToFinalizeBallotsRender = () => {
    return <Ballots isToFinalizeFilter={true} />
  }

  onNewBallotRender = () => {
    const { commonStore, contractsStore } = this.props

    if (!contractsStore.web3Instance) {
      if (!commonStore.loading) {
        swal({
          title: 'Error',
          html: messages.NO_METAMASK_MSG,
          icon: 'error',
          type: 'error'
        })
      }
      return null
    }
    return <NewBallot networkBranch={this.getVotingNetworkBranch()} />
  }

  onSettingsRender = () => {
    return <Settings />
  }

  onSearch = e => {
    const { commonStore } = this.props
    commonStore.setSearchTerm(e.target.value.toLowerCase())
  }

  hideSearch = () => {
    const { commonStore } = this.props
    const currentPath = this.props.location.pathname

    return currentPath === `${commonStore.rootPath}/new`
  }

  toggleMobileMenu = () => {
    this.setState(prevState => ({ showMobileMenu: !prevState.showMobileMenu }))
  }

  getTitle = () => {
    const currentPath = this.props.location.pathname

    if (currentPath === `${this.state.navigationData[1].url}`) {
      return this.state.navigationData[1].title
    } else if (currentPath === `${this.state.navigationData[2].url}`) {
      return this.state.navigationData[2].title
    } else if (currentPath === `${this.state.navigationData[3].url}`) {
      return this.state.navigationData[3].title
    } else {
      return this.state.navigationData[0].title
    }
  }

  getNetIdClass() {
    const { netId } = this.props.contractsStore
    return netId in constants.NETWORKS && constants.NETWORKS[netId].TESTNET ? 'sokol' : ''
  }

  render() {
    const { commonStore, contractsStore } = this.props
    const networkBranch = this.getVotingNetworkBranch()

    return networkBranch ? (
      <div className={`lo-App ${this.state.showMobileMenu ? 'lo-App-menu-open' : ''}`}>
        {commonStore.loading ? <Loading networkBranch={networkBranch} /> : null}
        <Header
          baseRootPath={commonStore.rootPath}
          navigationData={this.state.navigationData}
          netId={contractsStore.netId}
          networkBranch={networkBranch}
          onMenuToggle={this.toggleMobileMenu}
          showMobileMenu={this.state.showMobileMenu}
        />
        {this.hideSearch() ? null : <SearchBar networkBranch={networkBranch} onSearch={this.onSearch} />}
        <MainTitle text={this.getTitle()} />
        <section
          className={`lo-App_Content lo-App_Content-${networkBranch} ${
            this.state.showMobileMenu ? 'lo-App_Content-mobile-menu-open' : ''
          }`}
        >
          <Route exact path={`/`} render={this.onBallotsRender} />
          <Route exact path={`${commonStore.rootPath}/`} render={this.onBallotsRender} />
          <Route exact path={`${commonStore.rootPath}/active`} render={this.onActiveBallotsRender} />
          <Route exact path={`${commonStore.rootPath}/tofinalize`} render={this.onToFinalizeBallotsRender} />
          <Route path={`${commonStore.rootPath}/new`} render={this.onNewBallotRender} />
        </section>
        <Footer networkBranch={networkBranch} />
      </div>
    ) : (
      <BaseLoader />
    )
  }
}

export default App
