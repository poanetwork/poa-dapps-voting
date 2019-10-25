import React from 'react'
import { inject, observer } from 'mobx-react'

@inject('commonStore')
@observer
export class SearchBar extends React.Component {
  render() {
    const { commonStore, networkBranch, onSearch } = this.props
    return (
      <div className={`sw-SearchBar sw-SearchBar-${networkBranch}`}>
        <div className="sw-SearchBar_Content">
          <input
            className={`sw-SearchBar_Input sw-SearchBar_Input-${networkBranch}`}
            onChange={onSearch}
            placeholder="Search..."
            type="search"
            value={commonStore.searchTerm}
          />
        </div>
      </div>
    )
  }
}
