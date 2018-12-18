import React from 'react'
import { NavLink } from 'react-router-dom'

export const MobileMenuLinks = ({ onMenuToggle, navigationData }) => {
  return (
    <div className="hd-MobileMenuLinks">
      <div className="hd-MobileMenuLinks_ItemsContainer" onClick={onMenuToggle}>
        {navigationData.map(item => (
          <NavLink
            activeClassName="hd-MobileMenuLinks_Item-active"
            className={`hd-MobileMenuLinks_Item ${item.class}`}
            exact
            to={item.url}
          >
            <i className={`link-icon ${item.icon}`} />
            <span className="hd-MobileMenuLinks_Text">{item.title}</span>
          </NavLink>
        ))}
      </div>
    </div>
  )
}
