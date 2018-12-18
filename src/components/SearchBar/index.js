import React from 'react'

export const SearchBar = ({ extraClassName = '', networkBranch = false, onSearch }) => {
  return (
    <div className={`sw-SearchBar sw-SearchBar-${networkBranch} ${extraClassName}`}>
      <div className="sw-SearchBar_Content">
        <input
          className={`sw-SearchBar_Input sw-SearchBar_Input-${networkBranch}`}
          onChange={onSearch}
          placeholder="Search..."
          type="search"
        />
      </div>
    </div>
  )
}
