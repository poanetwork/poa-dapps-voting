import React from 'react'
import { IconFinalize } from '../IconFinalize'

export const ButtonFinalize = ({ extraClassName = '', networkBranch, onClick, state = '', text = '' }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`sw-ButtonFinalize ${extraClassName} sw-ButtonFinalize-${networkBranch} sw-ButtonFinalize-${state}`}
    >
      <span className="sw-ButtonFinalize_Text">{text}</span> <IconFinalize networkBranch={networkBranch} />
    </button>
  )
}
