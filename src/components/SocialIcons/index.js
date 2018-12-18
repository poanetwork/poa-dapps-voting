import React from 'react'
import { IconGithub } from '../IconGithub'
import { IconPOA } from '../IconPOA'
import { IconTelegram } from '../IconTelegram'
import { IconTwitter } from '../IconTwitter'

const getIconBackgroundColor = networkBranch => {
  return (
    {
      dai: '#e3e7e9',
      poa: '#fff',
      sokol: '#fff'
    }[networkBranch] || '#fff'
  )
}

const getIconColor = networkBranch => {
  return (
    {
      dai: '#333',
      poa: '#5c34a2',
      sokol: '#6ac9b9'
    }[networkBranch] || '#5c34a2'
  )
}

export const SocialIcons = ({ extraClass = '', networkBranch = '' }) => {
  const backgroundColor = getIconBackgroundColor(networkBranch)
  const iconColor = getIconColor(networkBranch)

  return (
    <div className={`ft-SocialIcons ${extraClass}`}>
      <IconTwitter
        backgroundColor={backgroundColor}
        color={iconColor}
        text="POA Twitter"
        url="https://twitter.com/poanetwork"
      />
      <IconTelegram
        backgroundColor={backgroundColor}
        color={iconColor}
        text="POA Telegram"
        url="https://t.me/oraclesnetwork"
      />
      <IconGithub
        backgroundColor={backgroundColor}
        color={iconColor}
        text="POA Github"
        url="https://github.com/poanetwork"
      />
      <IconPOA text="POA Network" url="https://poa.net" backgroundColor={backgroundColor} color={iconColor} />
    </div>
  )
}
