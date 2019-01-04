import React from 'react'
import { NavLink } from 'react-router-dom'
import { constants } from '../../utils/constants'
import { NavigationIcon } from '../NavigationIcon'

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
