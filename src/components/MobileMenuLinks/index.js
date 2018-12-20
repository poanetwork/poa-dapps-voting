import React from 'react'
import { ButtonNewBallot } from '../ButtonNewBallot'
import { NavigationLinks } from '../NavigationLinks'

export const MobileMenuLinks = ({ onClick, networkBranch }) => {
  return (
    <div className={`hd-MobileMenuLinks hd-MobileMenuLinks-${networkBranch}`} onClick={onClick}>
      <NavigationLinks networkBranch={networkBranch} />
      <ButtonNewBallot networkBranch={networkBranch} />
    </div>
  )
}
