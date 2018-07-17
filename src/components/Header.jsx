import React from 'react'
import { Link } from 'react-router-dom'

export const Header = ({ netId }) => {
  let headerClassName = netId === '77' ? 'sokol' : ''
  const logoClassName = netId === '77' ? 'header-logo-sokol' : 'header-logo'
  return (
    <header className={`header ${headerClassName}`}>
      <div className="container">
        <Link to="/poa-dapps-voting" className={logoClassName} />
        <Link to="/poa-dapps-voting/new" className="header-new-ballot">
          New ballot
        </Link>
        {/*<Link to="/poa-dapps-voting/settings" className="header-settings">Settings</Link>*/}
      </div>
    </header>
  )
}
