import NavigationLinks from '../NavigationLinks.jsx'
import React from 'react'
import menuIconBase from '../../assets/images/icons/icon-menu.svg'
import menuIconSokol from '../../assets/images/icons/icon-menu-sokol.svg'
import menuOpenIconBase from '../../assets/images/icons/icon-close.svg'
import menuOpenIconSokol from '../../assets/images/icons/icon-close-sokol.svg'
import { Logo } from '../Logo'
import { MobileMenuLinks } from '../MobileMenuLinks'
import { constants } from '../../utils/constants'

export const Header = ({
  baseRootPath,
  navigationData,
  netId,
  networkBranch = undefined,
  onMenuToggle,
  showMobileMenu = false
}) => {
  const thisIsTestnet = netId in constants.NETWORKS && constants.NETWORKS[netId].TESTNET
  const menuIcon = thisIsTestnet ? menuIconSokol : menuIconBase
  const menuOpenIcon = thisIsTestnet ? menuOpenIconSokol : menuOpenIconBase

  return (
    <header className={`sw-Header sw-Header-${networkBranch} ${showMobileMenu ? 'sw-Header-menu-open' : ''}`}>
      {showMobileMenu ? <MobileMenuLinks onMenuToggle={onMenuToggle} navigationData={navigationData} /> : null}
      <div className="sw-Header_Content">
        <Logo networkBranch={networkBranch} href={baseRootPath} />
        <div className="links-container">
          <NavigationLinks navigationData={navigationData} />
        </div>
        <div className="mobile-menu">
          <img
            alt=""
            className={showMobileMenu ? 'mobile-menu-open-icon' : 'mobile-menu-icon'}
            onClick={onMenuToggle}
            src={showMobileMenu ? menuOpenIcon : menuIcon}
          />
        </div>
      </div>
    </header>
  )
}
