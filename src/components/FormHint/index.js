import React from 'react'

export const FormHint = ({ extraClassName = '', networkBranch, text }) => {
  return (
    <p
      className={`frm-FormHint frm-FormHint-${networkBranch} ${extraClassName}`}
      dangerouslySetInnerHTML={{ __html: text }}
    />
  )
}
