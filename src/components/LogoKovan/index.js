import React from 'react'
import logoKovan from './logo.svg'
import { NavLink } from 'react-router-dom'

export const LogoKovan = ({ href = null, extraClass = '' }) => {
  return (
    <NavLink to={href} className={`sw-LogoKovan ${extraClass}`}>
      <img className="sw-LogoKovan_Image" src={logoKovan} alt="" />
    </NavLink>
  )
}
