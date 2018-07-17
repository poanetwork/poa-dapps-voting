//import DevTools from 'mobx-react-devtools'
import './assets/App.css'
import Loading from './Loading'
import React, { Component } from 'react'
import { Header, Ballots, NewBallot, Settings, Footer } from './components'
import { Route } from 'react-router-dom'
import { inject, observer } from 'mobx-react'

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
          icon: '',
          title: 'All',
          url: commonStore.rootPath
        },
        {
          icon: '',
          title: 'Active',
          url: `${commonStore.rootPath}/active`
        },
        {
          icon: '',
          title: 'To Finalize',
          url: `${commonStore.rootPath}/tofinalize`
        },
        {
          icon: '',
          title: 'New Ballot',
          url: `${commonStore.rootPath}/new`
        }
        // {
        //   'icon': '',
        //   'title': 'Settings',
        //   'url': `${ commonStore.rootPath }/settings`
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

  render() {
    const { commonStore, contractsStore } = this.props
    const loading = commonStore.loading ? <Loading netId={contractsStore.netId} /> : ''

    const search = this.shouldShowSearch() ? (
      <input type="search" className="search-input" onChange={this.onSearch} />
    ) : (
      ''
    )

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
        <div
          className={`app-container ${this.state.showMobileMenu ? 'app-container-open-mobile-menu' : ''} ${
            this.state.netId === '77' ? 'sokol' : ''
          }`}
        >
          <div className="container">
            <div className="main-title-container">
              <span className="main-title">{this.getTitle()}</span>
              {search}
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
