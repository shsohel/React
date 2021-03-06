import { makeStyles } from '@material-ui/core';
import React, { useState } from 'react';

const useStyles = makeStyles(theme => ({
  root: {
    '& .MuiFormControl-root': {
      width: '80%',
      margin: theme.spacing(1)
    }
  }
}));

export function useForm(initialFieldsValues, validateOnChange = false, validate) {
  const [values, setValues] = useState(initialFieldsValues);
  const [errors, setErrors] = useState({});

  const handleInputChange = event => {
    const { name, value } = event.target;
    setValues({
      ...values,
      [name]: value
    });
    if (validateOnChange) {
      validate({ [name]: value });
    }
  };

  const resetForm = () => {
    setValues(initialFieldsValues);
    setErrors({});
  };

  return {
    values,
    setValues,
    errors,
    setErrors,
    resetForm,
    handleInputChange
  };
}

export function Form(props) {
  const classes = useStyles();
  const { children, ...other } = props;
  return (
    <form className={classes.root} autoComplete="off" {...other}>
      {props.children}
    </form>
  );
}
