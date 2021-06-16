import { Checkbox as MuiCheckbox, FormControlLabel } from '@material-ui/core';
import React from 'react';

export default function Checkbox({ checked, name, label, onChange, ...props }) {
  return (
    <>
      {/* <FormGroup row> */}
      <FormControlLabel
        control={<MuiCheckbox color="primary" checked={checked} onChange={onChange} name={name} {...props} />}
        label={label}
        {...props}
      />
      {/* </FormGroup> */}
    </>
  );
}
