import { TextField } from '@material-ui/core';
import React from 'react';

export default function TextInputArea({ className, label, placeholder, onChange, ...props }) {
  return (
    <>
      <TextField
        size="small"
        className={className}
        fullWidth
        multiline
        variant="filled"
        label={label}
        placeholder={placeholder}
        onChange={onChange}
        {...props}
      />
    </>
  );
}
