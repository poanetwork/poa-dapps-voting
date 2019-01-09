import React from 'react'
import { LogoPOA } from '../LogoPOA'
import { LogoSokol } from '../LogoSokol'
import { LogoDai } from '../LogoDai'

export const Logo = ({ href = null, extraClass = '', networkBranch = '' }) => {
  switch (networkBranch) {
    case 'sokol':
      return <LogoSokol href={href} extraClass={extraClass} />
    case 'dai':
    case 'dai-test':
      return <LogoDai href={href} extraClass={extraClass} />
    case 'poa':
    default:
      return <LogoPOA href={href} extraClass={extraClass} />
  }
}
