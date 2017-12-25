import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => (
  <footer className="footer">
    <div className="container">
      <p className="footer-rights">2017 POA Network. All rights reserved.</p>
      <Link to="/poa-dapps-voting" className="footer-logo"></Link>
      <div className="socials">
        <a href="https://twitter.com/oraclesorg" className="socials-i socials-i_twitter"></a>
        <a href="https://poa.network" className="socials-i socials-i_oracles"></a>
        <a href="https://t.me/oraclesnetwork" className="socials-i socials-i_telegram"></a>
        <a href="https://github.com/poanetwork/" className="socials-i socials-i_github"></a>
      </div>
    </div>
  </footer>
);
