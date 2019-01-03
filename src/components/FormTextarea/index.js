import React from 'react'
import { FormFieldTitle } from '../FormFieldTitle'
import { FormHint } from '../FormHint'

export const FormTextarea = ({
  disabled = false,
  extraClassName = '',
  hint,
  id,
  networkBranch,
  onChange,
  placeholder,
  title,
  value
}) => {
  return (
    <div className={`frm-FormTextarea ${extraClassName}`}>
      <FormFieldTitle htmlFor={id} text={title} />
      <textarea
        className="frm-FormTextarea_Field"
        disabled={disabled}
        id={id}
        onChange={onChange}
        placeholder={placeholder}
        rows="4"
        value={value}
      />
      {hint ? <FormHint text={hint} networkBranch={networkBranch} /> : null}
    </div>
  )
}
