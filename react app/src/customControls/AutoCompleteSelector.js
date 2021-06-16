import { TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import React from 'react';

export default function AutoCompleteSelector({
  controlId,
  options = [],
  getOptionLabel,
  variant,
  onChange,
  placeholder,
  ...props
}) {
  return (
    <>
      <Autocomplete
        id={controlId}
        size="small"
        options={options}
        getOptionLabel={getOptionLabel}
        onChange={onChange}
        renderInput={params => <TextField {...params} variant={variant} placeholder={placeholder} size="small" />}
        {...props}
      />
    </>
  );
}
