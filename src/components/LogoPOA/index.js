import React from 'react'
import logoPOA from './logo.svg'

export const LogoPOA = ({ href = null, extraClass = '' }) => {
  return (
    <a href={href} className={`sw-LogoPOA ${extraClass}`}>
      <img className="sw-LogoPOA_Image" src={logoPOA} alt="" />
    </a>
  )
}
