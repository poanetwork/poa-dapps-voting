import React from 'react'

const MAX_DETAILS_LENGTH = 500

export class BallotInfoContainer extends React.Component {
  constructor(props) {
    super(props)

    const { memo } = this.props

    this.state = {
      detailsCollapsed: memo.length > MAX_DETAILS_LENGTH
    }
  }

  toggleDetails = () => {
    this.setState(prevState => ({ detailsCollapsed: !prevState.detailsCollapsed }))
  }

  render() {
    let { memo = '', threshold, networkBranch } = this.props
    let toggleShowMore =
      memo.length > MAX_DETAILS_LENGTH ? (
        <span
          className={`bc-BallotInfoContainer_ToggleShow bc-BallotInfoContainer_ToggleShow-${networkBranch}`}
          onClick={this.toggleDetails}
        >
          {this.state.detailsCollapsed ? 'More...' : 'Less'}
        </span>
      ) : (
        ''
      )

    return (
      <div className="bc-BallotInfoContainer">
        <div className="bc-BallotInfoContainer_Info bc-BallotInfoContainer_Info-minimum">
          Minimum {threshold} validators are required to pass the proposal
        </div>
        <div
          className={`bc-BallotInfoContainer_Info bc-BallotInfoContainer_Info-details ${
            this.state.detailsCollapsed ? 'bc-BallotInfoContainer_Info-collapsed' : ''
          }`}
        >
          {this.state.detailsCollapsed ? memo.substr(0, memo.lastIndexOf(' ', MAX_DETAILS_LENGTH)) : memo}
          {toggleShowMore}
        </div>
      </div>
    )
  }
}
