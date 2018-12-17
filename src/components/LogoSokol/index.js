import React from 'react'
import logoSokol from './logo.svg'

export const LogoSokol = ({ href = null, extraClass = '' }) => {
  return (
    <a href={href} className={`sw-LogoSokol ${extraClass}`}>
      <img className="sw-LogoSokol_Image" src={logoSokol} alt="" />
    </a>
  )
}
