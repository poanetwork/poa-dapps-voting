import React from 'react'
import { IconAdd } from '../IconAdd'

export const ButtonAddBallot = ({ extraClassName = '', networkBranch, onClick }) => {
  return (
    <button
      className={`sw-ButtonAddBallot ${extraClassName} sw-ButtonAddBallot-${networkBranch}`}
      onClick={onClick}
      type="button"
    >
      Add Ballot <IconAdd networkBranch={networkBranch} />
    </button>
  )
}
