import { TextField } from '@material-ui/core';
import React from 'react';

export default function TextInput({ className, error = null, label, placeholder, onChange, ...props }) {
  return (
    <>
      <TextField
        size="small"
        className={className}
        fullWidth
        variant="filled"
        label={label}
        placeholder={placeholder}
        onChange={onChange}
        {...props}
        {...(error && { error: true, helperText: error })}
      />
    </>
  );
}
