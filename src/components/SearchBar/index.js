import React from 'react'

export class SearchBar extends React.Component {
  constructor(props) {
    super(props)
    this.state = { searchTerm: '' }
  }

  setSearchTerm(searchTerm) {
    this.setState({ searchTerm })
  }

  componentDidMount() {
    const { searchTerm } = this.props
    if (searchTerm !== undefined) {
      this.setSearchTerm(searchTerm)
    }
  }

  render() {
    const { networkBranch, onSearch } = this.props
    return (
      <div className={`sw-SearchBar sw-SearchBar-${networkBranch}`}>
        <div className="sw-SearchBar_Content">
          <input
            className={`sw-SearchBar_Input sw-SearchBar_Input-${networkBranch}`}
            onChange={onSearch}
            placeholder="Search..."
            type="search"
            value={this.state.searchTerm}
          />
        </div>
      </div>
    )
  }
}
