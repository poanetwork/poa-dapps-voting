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
      <label className="frm-FormSelect_Title" htmlFor={id}>
        {title}
      </label>
      <Select.Creatable name={name} id={id} value={value} onChange={onChange} options={options} disabled={disabled} />
      {hint ? <FormHint text={hint} networkBranch={networkBranch} /> : null}
    </div>
  )
}
