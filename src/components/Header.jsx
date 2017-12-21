import React from 'react';
import { Link } from 'react-router-dom';

export const Header = () => (
  <header className="header">
    <div className="container">
      <Link to="/poa-dapps-voting" className="header-logo"></Link>
      <Link to="/poa-dapps-voting/new" className="header-new-ballot">New ballot</Link>
      {/*<Link to="/poa-dapps-voting/settings" className="header-settings">Settings</Link>*/}
    </div>
  </header>
);
