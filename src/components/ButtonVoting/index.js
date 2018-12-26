import React from 'react'

export const ButtonVoting = ({
  extraClassName = '',
  networkBranch,
  onClick,
  side = 'left',
  size = 'sm',
  text = '',
  type = 'positive'
}) => {
  let buttonSize = ''

  switch (size) {
    case 'md' || 'medium':
      buttonSize = 'vt-ButtonVoting-md'
      break
    case 'lg' || 'large':
      buttonSize = 'vt-ButtonVoting-lg'
      break
    case 'sm' || 'small':
    default:
      buttonSize = 'vt-ButtonVoting-sm'
      break
  }

  return (
    <button
      className={`vt-ButtonVoting ${extraClassName} vt-ButtonVoting-${networkBranch} ${buttonSize} vt-ButtonVoting-${type} vt-ButtonVoting-${side}`}
      onClick={onClick}
      type="button"
    >
      {text}
    </button>
  )
}
