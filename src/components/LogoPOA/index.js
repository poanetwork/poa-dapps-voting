import React from 'react'
import logoPOA from './logo.svg'
import { NavLink } from 'react-router-dom'

export const LogoPOA = ({ href = null, extraClass = '' }) => {
  return (
    <NavLink to={href} className={`sw-LogoPOA ${extraClass}`}>
      <img className="sw-LogoPOA_Image" src={logoPOA} alt="" />
    </NavLink>
  )
}
