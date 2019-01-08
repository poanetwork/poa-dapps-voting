import React from 'react'
import logoSokol from './logo.svg'
import { NavLink } from 'react-router-dom'

export const LogoSokol = ({ href = null, extraClass = '' }) => {
  return (
    <NavLink to={href} className={`sw-LogoSokol ${extraClass}`}>
      <img className="sw-LogoSokol_Image" src={logoSokol} alt="" />
    </NavLink>
  )
}
