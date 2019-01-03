import React from 'react'
import Select from 'react-select'
import { FormFieldTitle } from '../FormFieldTitle'
import { FormHint } from '../FormHint'

export const FormSelect = ({
  disabled = false,
  extraClassName = '',
  hint,
  id,
  name = '',
  networkBranch,
  onChange,
  options,
  title,
  value
}) => {
  return (
    <div className={`frm-FormSelect ${extraClassName}`}>
      <FormFieldTitle htmlFor={id} text={title} />
      <Select.Creatable
        className="frm-FormSelect_Select"
        disabled={disabled}
        id={id}
        name={name}
        onChange={onChange}
        options={options}
        value={value}
      />
      {hint ? <FormHint text={hint} networkBranch={networkBranch} /> : null}
    </div>
  )
}
