import React from 'react'
import { IconLoadMore } from '../IconLoadMore'

export const ButtonLoadMore = ({ extraClassName = '', networkBranch, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`sw-ButtonLoadMore ${extraClassName} sw-ButtonLoadMore-${networkBranch}`}
    >
      <span className="sw-ButtonLoadMore_Text">Load More Ballots</span> <IconLoadMore networkBranch={networkBranch} />
    </button>
  )
}
