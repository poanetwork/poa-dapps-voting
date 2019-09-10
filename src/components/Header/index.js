import React from 'react'
import Select from 'react-select'

import { ButtonNewBallot } from '../ButtonNewBallot'
import { IconMobileMenu } from '../IconMobileMenu'
import { Logo } from '../Logo'
import { MobileMenuLinks } from '../MobileMenuLinks'
import { NavigationLinks } from '../NavigationLinks'

import { constants } from '../../utils/constants'

const getNetworkOptions = () => {
  let selectOptions = []

  for (const _netId in constants.NETWORKS) {
    selectOptions.push({ value: _netId, label: `Network: ${constants.NETWORKS[_netId].NAME}` })
  }

  return selectOptions
}

export const Header = ({
  baseRootPath = '',
  injectedWeb3,
  netId,
  networkBranch = undefined,
  onChange,
  onMenuToggle,
  showMobileMenu = false
}) => {
  let networkSelect = !injectedWeb3 ? (
    <Select
      className="top-Select"
      clearable={false}
      onChange={onChange}
      options={getNetworkOptions()}
      searchable={false}
      value={netId}
    />
  ) : null

  return (
    <header className={`sw-Header sw-Header-${networkBranch} ${showMobileMenu ? 'sw-Header-menu-open' : ''}`}>
      {showMobileMenu ? <MobileMenuLinks networkBranch={networkBranch} onClick={onMenuToggle} /> : null}
      <div className="sw-Header_Content">
        <Logo networkBranch={networkBranch} href={baseRootPath} />
        <div className="sw-Header_Links">
          <NavigationLinks networkBranch={networkBranch} />
          <ButtonNewBallot networkBranch={networkBranch} />
        </div>
        {networkSelect}
        <IconMobileMenu networkBranch={networkBranch} isOpen={showMobileMenu} onClick={onMenuToggle} />
      </div>
    </header>
  )
}
