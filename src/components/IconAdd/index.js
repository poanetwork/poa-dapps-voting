import React from 'react'

export const IconAdd = ({ networkBranch }) => {
  return (
    <svg className="sw-IconAdd" xmlns="http://www.w3.org/2000/svg" width="14" height="14">
      <path
        className={`sw-IconAdd_Path sw-IconAdd_Path-${networkBranch}`}
        d="M13 8H8v5a1 1 0 0 1-2 0V8H1a1 1 0 0 1 0-2h5V1a1 1 0 0 1 2 0v5h5a1 1 0 0 1 0 2z"
        fillRule="evenodd"
      />
    </svg>
  )
}
