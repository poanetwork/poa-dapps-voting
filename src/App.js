import React, { Component } from 'react'
import swal from 'sweetalert2'
import { Header, Ballots, NewBallot, Settings, Footer, Loading, BaseLoader, SearchBar, MainTitle } from './components'
import { Route, Redirect } from 'react-router-dom'
import { constants } from './utils/constants'
import { getNetworkBranch } from './utils/utils'
import { inject, observer } from 'mobx-react'
import messages from './utils/messages'
import { enableWallet } from './utils/getWeb3'

import './assets/stylesheets/index.css'

@inject('commonStore', 'contractsStore')
@observer
class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      showMobileMenu: false
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

    if (!commonStore.loading) {
      enableWallet(contractsStore.updateKeys)
        .then(() => {
          if (!contractsStore.injectedWeb3) {
            swal({
              title: 'Error',
              html: messages.NO_METAMASK_MSG,
              type: 'error'
            })
          } else if (!contractsStore.networkMatch) {
            swal({
              title: 'Warning!',
              html: messages.networkMatchError(contractsStore.netId),
              type: 'warning'
            })
          } else if (!contractsStore.isValidVotingKey) {
            swal({
              title: 'Warning!',
              html: messages.invalidVotingKeyMsg(contractsStore.votingKey),
              type: 'warning'
            })
          }
        })
        .catch(error => {
          swal('Error', error.message, 'error')
        })
    }
    return <NewBallot networkBranch={this.getVotingNetworkBranch()} />
  }

  onSettingsRender = () => {
    return <Settings />
  }

  onSearch = e => {
    this.setSearchTerm(e.target.value)
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
    let obj = constants.navigationData.find(element => element.url === this.props.location.pathname)

    if (obj) {
      return obj.title
    }

    return 'All'
  }

  setSearchTerm = term => {
    const { commonStore } = this.props
    commonStore.setSearchTerm(term.toLowerCase())
    if (this.refs.searchBar) {
      this.refs.searchBar.setSearchTerm(term)
    }
  }

  onNetworkChange = e => {
    this.setSearchTerm('')
    this.props.onNetworkChange(e)
  }

  isNewBallotPage() {
    return `${constants.rootPath}/new` === this.props.location.pathname
  }

  render() {
    const { commonStore, contractsStore } = this.props
    const networkBranch = commonStore.loadingNetworkBranch
      ? commonStore.loadingNetworkBranch
      : this.getVotingNetworkBranch()

    return networkBranch ? (
      <div
        className={`lo-App ${this.isNewBallotPage() ? 'lo-App-no-search-bar' : ''} ${
          this.state.showMobileMenu ? 'lo-App-menu-open' : ''
        }`}
      >
        {commonStore.loading ? <Loading networkBranch={networkBranch} /> : null}
        <Header
          baseRootPath={commonStore.rootPath}
          netId={contractsStore.netId}
          networkBranch={networkBranch}
          onChange={this.onNetworkChange}
          onMenuToggle={this.toggleMobileMenu}
          showMobileMenu={this.state.showMobileMenu}
        />
        {this.hideSearch() ? null : (
          <SearchBar
            networkBranch={networkBranch}
            onSearch={this.onSearch}
            searchTerm={commonStore.searchTerm}
            ref="searchBar"
          />
        )}
        <MainTitle text={this.getTitle()} />
        <section
          className={`lo-App_Content lo-App_Content-${networkBranch} ${
            this.state.showMobileMenu ? 'lo-App_Content-mobile-menu-open' : ''
          }`}
        >
          <Route
            exact
            path={`/`}
            render={props => (
              <Redirect
                to={{
                  pathname: `${commonStore.rootPath}/`
                }}
              />
            )}
          />
          <Route exact path={`${commonStore.rootPath}/`} render={this.onBallotsRender} />
          <Route exact path={`${commonStore.rootPath}/active`} render={this.onActiveBallotsRender} />
          <Route exact path={`${commonStore.rootPath}/tofinalize`} render={this.onToFinalizeBallotsRender} />
          <Route path={`${commonStore.rootPath}/new`} render={this.onNewBallotRender} />
        </section>
        <Footer baseRootPath={commonStore.rootPath} networkBranch={networkBranch} />
      </div>
    ) : (
      <BaseLoader />
    )
  }
}

export default App
