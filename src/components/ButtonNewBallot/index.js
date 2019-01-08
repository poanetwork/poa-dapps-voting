import React from 'react'
import { IconAdd } from '../IconAdd'
import { NavLink } from 'react-router-dom'
import { constants } from '../../utils/constants'
import { scrollToTop } from '../../utils/utils'

export const ButtonNewBallot = ({ extraClassName = '', networkBranch }) => {
  return (
    <NavLink
      className={`sw-ButtonNewBallot ${extraClassName} sw-ButtonNewBallot-${networkBranch}`}
      onClick={scrollToTop()}
      to={`${constants.rootPath}/new`}
    >
      New Ballot <IconAdd networkBranch={networkBranch} />
    </NavLink>
  )
}
