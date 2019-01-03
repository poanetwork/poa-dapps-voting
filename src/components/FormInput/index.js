import React from 'react'
import { FormFieldTitle } from '../FormFieldTitle'
import { FormHint } from '../FormHint'

export const FormInput = ({
  disabled = false,
  extraClassName = '',
  hint,
  id,
  min,
  networkBranch,
  onChange,
  placeholder,
  title,
  type = 'text',
  value
}) => {
  return (
    <div className={`frm-FormInput ${extraClassName}`}>
      <FormFieldTitle htmlFor={id} text={title} />
      <input
        className="frm-FormInput_Field"
        disabled={disabled}
        id={id}
        min={min}
        onChange={onChange}
        placeholder={placeholder}
        type={type}
        value={value}
      />
      {hint ? <FormHint text={hint} networkBranch={networkBranch} /> : null}
    </div>
  )
}
