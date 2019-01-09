import React from 'react'

export const IconFinalize = ({ networkBranch }) => {
  return (
    <svg className="sw-IconFinalize" xmlns="http://www.w3.org/2000/svg" width="16" height="18">
      <path
        className={`sw-IconFinalize_Path sw-IconFinalize_Path-${networkBranch}`}
        d="M15 15h-5a1 1 0 0 1-1-1v-3H2v6a1 1 0 0 1-2 0V1a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v3h4a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1zM9 2H2v7h7V2zm2 11h3V6h-3v7z"
        fillRule="evenodd"
      />
    </svg>
  )
}
