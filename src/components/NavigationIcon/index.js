import React from 'react'
import { IconAll } from './IconAll'
import { IconActive } from './IconActive'
import { IconToFinalize } from './IconToFinalize'

export const NavigationIcon = ({ icon, networkBranch }) => {
  switch (icon) {
    case 'all':
      return <IconAll networkBranch={networkBranch} />
    case 'active':
      return <IconActive networkBranch={networkBranch} />
    case 'finalize':
      return <IconToFinalize networkBranch={networkBranch} />
    default:
      return null
  }
}
