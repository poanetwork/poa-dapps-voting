import React from 'react'
import { NavLink } from 'react-router-dom'
import { NavigationIcon } from '../NavigationIcon'
import { constants } from '../../utils/constants'
import { scrollToTop } from '../../utils/utils'

export const NavigationLinks = ({ networkBranch }) => {
  return (
    <div className="nl-NavigationLinks">
      {constants.navigationData.map(
        (item, index) =>
          item.disabled ? null : (
            <NavLink
              activeClassName="active"
              className={`nl-NavigationLinks_Link nl-NavigationLinks_Link-${networkBranch}`}
              exact
              key={index}
              onClick={scrollToTop()}
              to={item.url}
            >
              <NavigationIcon networkBranch={networkBranch} icon={item.icon} />
              <span className={`nl-NavigationLinks_Text nl-NavigationLinks_Text-${networkBranch}`}>{item.title}</span>
            </NavLink>
          )
      )}
    </div>
  )
}
