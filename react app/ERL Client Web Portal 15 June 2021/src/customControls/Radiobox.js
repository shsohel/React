import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@material-ui/core';
import React from 'react';

export default function Radiobox({ name, groupName, value, onChange, row, options, ...props }) {
  return (
    <FormControl>
      <FormLabel>{groupName}</FormLabel>
      <RadioGroup
        row={row} // row attribute define the radio group are single line or multiline
        name={name}
        value={value}
        onChange={onChange}
        {...props}>
        {options.map(option => (
          <FormControlLabel
            key={option.value}
            value={option.value}
            control={<Radio color="primary" />}
            label={option.label}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
}
