import React from 'react'
import { ButtonNewBallot } from '../ButtonNewBallot'
import { IconMobileMenu } from '../IconMobileMenu'
import { Logo } from '../Logo'
import { MobileMenuLinks } from '../MobileMenuLinks'
import { NavigationLinks } from '../NavigationLinks'

export const Header = ({
  baseRootPath,
  navigationData,
  networkBranch = undefined,
  onMenuToggle,
  showMobileMenu = false
}) => {
  return (
    <header className={`sw-Header sw-Header-${networkBranch} ${showMobileMenu ? 'sw-Header-menu-open' : ''}`}>
      {showMobileMenu ? <MobileMenuLinks onMenuToggle={onMenuToggle} navigationData={navigationData} /> : null}
      <div className="sw-Header_Content">
        <Logo networkBranch={networkBranch} href={baseRootPath} />
        <div className="sw-Header_Links">
          <NavigationLinks networkBranch={networkBranch} navigationData={navigationData} />
          <ButtonNewBallot networkBranch={networkBranch} />
        </div>
        <IconMobileMenu networkBranch={networkBranch} isOpen={showMobileMenu} onClick={onMenuToggle} />
      </div>
    </header>
  )
}
