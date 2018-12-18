import React from 'react'
import { IconAll } from './IconAll'
import { IconActive } from './IconActive'
import { IconFinalize } from './IconFinalize'

export const NavigationIcon = ({ icon, networkBranch }) => {
  switch (icon) {
    case 'all':
      return <IconAll networkBranch={networkBranch} />
    case 'active':
      return <IconActive networkBranch={networkBranch} />
    case 'finalize':
      return <IconFinalize networkBranch={networkBranch} />
    default:
      return null
  }
}
