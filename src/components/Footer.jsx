import React from 'react'
import moment from 'moment'
import { Link } from 'react-router-dom'
import Socials from './Socials'

export const Footer = ({ netId }) => {
  const footerClassName = netId === '77' ? 'sokol' : ''

  return (
    <footer className={`footer ${footerClassName}`}>
      <div className="container">
        <Link to="/poa-dapps-voting" className="footer-logo" />
        <p className="footer-rights">{moment().format('YYYY')} POA Network. All rights reserved.</p>
        <Socials />
      </div>
    </footer>
  )
}
