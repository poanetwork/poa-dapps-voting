import React from 'react'
import { NavLink } from 'react-router-dom'

const NavigationLinks = ({ navigationData }) => {
  return navigationData.map((item, index) => (
    <NavLink activeClassName="active" className={`link ${item.class}`} exact key={index} to={item.url}>
      <i className={`link-icon ${item.icon}`} />
      <span className="link-text">{item.title}</span>
    </NavLink>
  ))
}

export default NavigationLinks
