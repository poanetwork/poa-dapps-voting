import React from 'react'

export const FormFieldTitle = ({ extraClassName = '', text, htmlFor }) => {
  return (
    <label className={`frm-FormFieldTitle ${extraClassName}`} htmlFor={htmlFor}>
      {text}
    </label>
  )
}
