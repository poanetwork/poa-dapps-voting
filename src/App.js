//import DevTools from 'mobx-react-devtools'
import './assets/App.css'
import Loading from './Loading'
import React, { Component } from 'react'
import { Header, Ballots, NewBallot, Settings, Footer } from './components'
import { Route } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import swal from 'sweetalert2'
import { messages } from './messages'
import { constants } from './constants'

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
        // {
        //   'icon': '',
        //   'title': 'Settings',
        //   'url': `${ commonStore.rootPath }/settings`,
        //    class: ''
        // }
      ]
    }
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
    return <NewBallot />
  }

  onSettingsRender = () => {
    return <Settings />
  }

  onSearch = e => {
    const { commonStore } = this.props
    commonStore.setSearchTerm(e.target.value.toLowerCase())
  }

  shouldShowSearch = () => {
    const { commonStore } = this.props
    const currentPath = this.props.location.pathname

    let showSearch =
      currentPath === `${commonStore.rootPath}` ||
      currentPath === '/' ||
      currentPath === `${commonStore.rootPath}/` ||
      currentPath === `${commonStore.rootPath}/active` ||
      currentPath === `${commonStore.rootPath}/tofinalize`

    return showSearch
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
    const loading = commonStore.loading ? <Loading netId={contractsStore.netId} /> : ''

    const search = this.shouldShowSearch() ? (
      <div className={`search-container ${this.getNetIdClass()}`}>
        <div className="container">
          <input type="search" className="search-input" onChange={this.onSearch} placeholder="Search..." />
        </div>
      </div>
    ) : (
      ''
    )

    const isTestnet = contractsStore.netId in constants.NETWORKS && constants.NETWORKS[contractsStore.netId].TESTNET

    return (
      <section className={`content ${this.state.showMobileMenu ? 'content-menu-open' : ''}`}>
        {loading}
        <Header
          baseRootPath={commonStore.rootPath}
          navigationData={this.state.navigationData}
          netId={contractsStore.netId}
          onMenuToggle={this.toggleMobileMenu}
          showMobileMenu={this.state.showMobileMenu}
        />
        {search}
        <div
          className={`app-container ${this.state.showMobileMenu ? 'app-container-open-mobile-menu' : ''} ${
            isTestnet ? 'sokol' : ''
          }`}
        >
          <div className="container">
            <div className={`main-title-container ${this.shouldShowSearch() ? '' : 'no-search-on-top'}`}>
              <span className="main-title">{this.getTitle()}</span>
            </div>
          </div>
          <Route exact path={`/`} render={this.onBallotsRender} />
          <Route exact path={`${commonStore.rootPath}/`} render={this.onBallotsRender} />
          <Route exact path={`${commonStore.rootPath}/active`} render={this.onActiveBallotsRender} />
          <Route exact path={`${commonStore.rootPath}/tofinalize`} render={this.onToFinalizeBallotsRender} />
          <Route path={`${commonStore.rootPath}/new`} render={this.onNewBallotRender} />
          {/*<Route path={`${commonStore.rootPath}/settings`} render={this.onSettingsRender}/>*/}
        </div>
        <Footer netId={contractsStore.netId} />
      </section>
    )
  }
}

export default App
