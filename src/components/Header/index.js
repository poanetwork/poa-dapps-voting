import React from 'react'

import { ButtonNewBallot } from '../ButtonNewBallot'
import { IconMobileMenu } from '../IconMobileMenu'
import { Logo } from '../Logo'
import { MobileMenuLinks } from '../MobileMenuLinks'
import { NavigationLinks } from '../NavigationLinks'
import NetworkSelect from '../NetworkSelect'

export const Header = ({
  baseRootPath = '',
  networkBranch = undefined,
  onChange,
  onMenuToggle,
  showMobileMenu = false
}) => {
  return (
    <header className={`sw-Header sw-Header-${networkBranch} ${showMobileMenu ? 'sw-Header-menu-open' : ''}`}>
      {showMobileMenu ? (
        <MobileMenuLinks networkBranch={networkBranch} onClick={onMenuToggle} onNetworkChange={onChange} />
      ) : null}
      <div className="sw-Header_Content">
        <Logo networkBranch={networkBranch} href={baseRootPath} />
        <div className="sw-Header_Links">
          <NavigationLinks networkBranch={networkBranch} />
          <ButtonNewBallot networkBranch={networkBranch} />
        </div>
        <NetworkSelect networkBranch={networkBranch} onChange={onChange} />
        <IconMobileMenu networkBranch={networkBranch} isOpen={showMobileMenu} onClick={onMenuToggle} />
      </div>
    </header>
  )
}
