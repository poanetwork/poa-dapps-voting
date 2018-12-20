import React from 'react'

export const MainTitle = ({ extraClassName = '', text = '' }) => {
  return (
    <div className={`sw-MainTitle ${extraClassName}`}>
      <div className="sw-MainTitle_Content">
        <h1 className="sw-MainTitle_Text">{text}</h1>
      </div>
    </div>
  )
}
