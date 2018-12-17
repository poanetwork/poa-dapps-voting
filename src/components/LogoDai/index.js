import React from 'react'
import logoSokol from './logo.svg'

export const LogoDai = ({ href = null, extraClass = '' }) => {
  return (
    <a href={href} className={`sw-LogoDai ${extraClass}`}>
      <img className="sw-LogoDai_Image" src={logoSokol} alt="" />
    </a>
  )
}
