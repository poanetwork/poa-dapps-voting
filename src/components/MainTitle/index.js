import React from 'react'

export const MainTitle = ({ extraClassName = '', text = '' }) => {
  return (
    <div className={`sw-MainTitle ${extraClassName}`}>
      <div className="sw-MainTitle_Content">
        <span className="sw-MainTitle_Text">{text}</span>
      </div>
    </div>
  )
}
