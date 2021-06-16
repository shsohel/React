import { KeyboardDateTimePicker } from '@material-ui/pickers';
import React from 'react';

export default function DateTimeInputPicker({ label, format, value, onChange, ...props }) {
  return (
    <>
      <KeyboardDateTimePicker
        value={value}
        autoFocus
        onChange={onChange}
        format={format}
        label={label}
        showTodayButton
        {...props}
      />
    </>
  );
}
