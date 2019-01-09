import PlacesAutocomplete from 'react-places-autocomplete'
import React from 'react'
import { FormFieldTitle } from '../FormFieldTitle'
import { FormHint } from '../FormHint'

export const FormAutocomplete = ({
  extraClassName = '',
  hint,
  id,
  networkBranch,
  onSelect,
  title,
  autocompleteItem,
  inputProps
}) => {
  return (
    <div className={`frm-FormAutocomplete ${extraClassName}`}>
      <FormFieldTitle htmlFor={id} text={title} />
      <PlacesAutocomplete autocompleteItem={autocompleteItem} inputProps={inputProps} onSelect={onSelect} />
      {hint ? <FormHint text={hint} networkBranch={networkBranch} /> : null}
    </div>
  )
}
