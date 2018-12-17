import React from 'react'
import moment from 'moment'
import { Logo } from '../Logo'
import { SocialIcons } from '../SocialIcons'
import { constants } from '../../utils/constants'

export const Footer = ({ extraClassName = '', networkBranch = false }) => {
  return (
    <footer className={`sw-Footer ${extraClassName} ${networkBranch ? 'sw-Footer-' + networkBranch : ''}`}>
      <div className="sw-Footer_Content">
        <Logo networkBranch={networkBranch} href={constants.baseURL} />
        <p className="sw-Footer_Text">{moment().format('YYYY')} POA Network. All rights reserved.</p>
        <SocialIcons networkBranch={networkBranch} />
      </div>
    </footer>
  )
}
