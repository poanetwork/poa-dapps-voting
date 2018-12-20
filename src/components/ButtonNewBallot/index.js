import React from 'react'
import { constants } from '../../utils/constants'
import { IconAdd } from '../IconAdd'

export const ButtonNewBallot = ({ extraClassName = '', networkBranch }) => {
  return (
    <a
      href={`${constants.rootPath}/new`}
      className={`sw-ButtonNewBallot ${extraClassName} sw-ButtonNewBallot-${networkBranch}`}
    >
      New Ballot <IconAdd networkBranch={networkBranch} />
    </a>
  )
}
