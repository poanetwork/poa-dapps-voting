import React from "react";
import logoBase from '../assets/images/logos/logo_voting_dapp@2x.png';
import logoSokol from '../assets/images/logos/logo_sokol@2x.png';
import menuIconBase from '../assets/images/icons/icon-menu.svg';
import menuIconSokol from '../assets/images/icons/icon-menu-sokol.svg';
import menuOpenIconBase from '../assets/images/icons/icon-close.svg';
import menuOpenIconSokol from '../assets/images/icons/icon-close-sokol.svg';
import NavigationLinks from "./NavigationLinks";
import MobileMenuLinks from './MobileMenuLinks';

export const Header = ({ netId, baseRootPath, navigationData, showMobileMenu, onMenuToggle }) => {

  const headerClassName = netId === '77' ? 'sokol' : '';
  const logoImageName = netId === '77' ? logoSokol : logoBase;
  const menuIcon = netId === '77' ? menuIconSokol : menuIconBase;
  const menuOpenIcon = netId === '77' ? menuOpenIconSokol : menuOpenIconBase;

  return (
    <header className={`header ${ headerClassName }`}>
      { showMobileMenu &&
        (<div className="header-mobile-menu-container">{ <MobileMenuLinks onMenuToggle={ onMenuToggle } navigationData={ navigationData } /> }</div>)
      }
      <div className='container'>
        <a
          className="header-logo-a"
          href={ baseRootPath }
        >
          <img
            className="header-logo"
            src={ logoImageName }
            alt=""
          />
        </a>
        <div className="links-container">
          <NavigationLinks navigationData={ navigationData } />
        </div>
        <div className="mobile-menu">
          <img
            alt=""
            className={
              showMobileMenu ? "mobile-menu-open-icon" : "mobile-menu-icon"
            }
            onClick={ onMenuToggle }
            src={ showMobileMenu ? menuOpenIcon : menuIcon }
          />
        </div>
      </div>
    </header>
  );
};
