import { KeyboardDatePicker } from '@material-ui/pickers';
import React from 'react';

export default function DateInputPicker({ controlId, label, format, value, onChange, ...props }) {
  return (
    <KeyboardDatePicker
      fullWidth
      autoFocus
      style={{
        borderTopLeftRadius: '5px',
        borderTopRightRadius: '5px',
        backgroundColor: '#DEDEDE',
        paddingBlockStart: '5px'
      }}
      margin="none"
      size="small"
      id={controlId}
      label={label}
      format={format}
      value={value}
      onChange={onChange}
      KeyboardButtonProps={{
        'aria-label': 'change date'
      }}
      {...props}
    />
  );
}
