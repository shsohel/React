import { MenuItem, TextField } from '@material-ui/core';
import React from 'react';

export default function Dropdown({
  className,
  controlId,
  name,
  label,
  placeholder,
  value,
  onChange,
  options = [],
  ...props
}) {
  return (
    <>
      <TextField
        id={controlId}
        className={className}
        select
        fullWidth
        name={name}
        label={label}
        value={value}
        onChange={onChange}
        variant="filled"
        placeholder={placeholder}
        size="small"
        {...props}>
        {options.map(option => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
    </>
  );
}
