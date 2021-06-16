import CmtImage from '@coremat/CmtImage';
import { Box, Button, Grid, IconButton, InputAdornment, Paper, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import { roleTypes } from 'constants/RoleTypes';
import PageContainer from 'containers/PageComponents/layouts/PageContainer';
import { AutoCompleteSelector, Dropdown, TextInput } from 'customControls';
import { CancelButton, ResetButton, SubmitButton } from 'customControls/ActionButtons/ActionButtons';
import React, { useEffect, useState } from 'react';
import { NotificationContainer } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import axios, { urls } from 'services/auth/jwt/config';
import { alerts } from 'utils/alert';
import { Form, useForm } from 'utils/useForm';
const useStyles = makeStyles(theme => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '25ch'
    }
  },
  alert: {
    '& > *': {
      marginBottom: theme.spacing(3),
      '&:not(:last-child)': {
        marginRight: theme.spacing(3)
      }
    }
  },
  formControl: {
    margin: theme.spacing(2),
    width: '90%'
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  chip: {
    margin: 2
  },
  noLabel: {
    marginTop: theme.spacing(6)
  },
  paper: {
    padding: theme.spacing(6),
    color: theme.palette.text.secondary,
    minWidth: '50px'
  },
  photoBox: {
    width: '100%',
    height: '100%',
    minHeight: 200,
    overflow: 'hidden',
    '& .jvectormap-container': {
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      backgroundColor: `${theme.palette.background.paper} !important`
    },
    padding: theme.spacing(5)
  },
  circularProgressRoot: {
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: 1,
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  changeButton: {
    color: 'green',
    fontWeight: 'bold'
  },
  cancelButton: {
    marginLeft: '0.8rem',
    marginTop: '0.2rem',
    color: 'red'
  },
  photoChange: {
    margin: theme.spacing(3)
  },
  avator: {
    border: 'solid 2px',
    borderColor: '#C6C6C6',
    height: '250px',
    width: '250px',
    objectFit: 'contain'
  }
}));

const breadcrumbs = [
  { label: 'Users', link: '/accounts/user' },
  { label: 'New', link: 'accounts/user-new', isActive: true }
];

const initialFieldsValues = {
  id: 0,
  firstName: '',
  lastName: '',
  companyId: 0,
  companyName: '',
  email: '',
  userName: '',
  password: '',
  confirmPassword: ''
};

export default function UserForm(props) {
  const classes = useStyles();
  const [customers, setCustomers] = useState([]);
  const [roleName, setRoleName] = useState('');
  const [roles, setRoles] = useState([]);
  const [isPhotoChange, setIsPhotoChange] = useState(false);
  const [previewPhoto, setPreviewPhoto] = useState({ image: null });
  const [fileBase64, setFileBase64] = useState('');
  const [isPasswordShow, setIsPasswordShow] = useState({
    show: false
  });
  const { authUser } = useSelector(({ auth }) => auth);

  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    if ('userName' in fieldValues) temp.userName = fieldValues.userName ? '' : 'User Name is requird';
    if ('firstName' in fieldValues) temp.firstName = fieldValues.firstName ? '' : 'First Name is requird';
    if ('lastName' in fieldValues) temp.lastName = fieldValues.lastName ? '' : 'Last Name is requird';
    if ('email' in fieldValues) temp.email = fieldValues.email ? '' : 'Email is requird';
    // if ('companyId' in fieldValues) temp.companyId = fieldValues.companyId ? '' : 'This fields is requird';
    // if ('companyName' in fieldValues) temp.companyName = fieldValues.companyName ? '' : 'This fields is requird';
    if ('password' in fieldValues) temp.password = fieldValues.password ? '' : 'Password is requird';
    if ('confirmPassword' in fieldValues)
      temp.confirmPassword = fieldValues.confirmPassword ? '' : 'Confirm Password fields is requird';

    setErrors({
      ...temp
    });
    if (fieldValues === values) return Object.values(temp).every(x => x === '');
  };
  const { values, setValues, errors, setErrors, resetForm, handleInputChange } = useForm(
    initialFieldsValues,
    true,
    validate
  );

  const getAllRoles = async () => {
    await axios
      .get(`${urls.account.roles.get_all}`)
      .then(res => {
        const body = res.data;
        setRoles(body.map(item => item.name));
      })
      .catch(err => {
        console.log(err);
      });
  };
  const getAllCustomers = async () => {
    await axios
      .get(`${urls.customer.get_all_customer_name}`)
      .then(res => {
        const body = res.data.data;
        setCustomers(
          body.map(item => ({
            value: item.id,
            label: item.nameEN
          }))
        );
      })
      .catch(err => {
        console.log(err);
      });
  };

  const resetFormField = params => {
    setValues(initialFieldsValues);
    setRoleName('');
  };

  const handleCustomerChange = e => {
    if (e.target.value === '') {
      return;
    }
    const selectedCustomer = e.target.value === '' ? null : customers.find(item => item.value === e.target.value);
    setValues({
      ...values,
      companyId: selectedCustomer.value,
      companyName: selectedCustomer.label
    });
  };
  useEffect(() => {
    getAllRoles();
    getAllCustomers();
  }, []);

  const handleMultipleRolesSelect = roles => {
    setRoleName(roles);
  };

  const handlePhotoChange = e => {
    setPreviewPhoto({
      image: URL.createObjectURL(e.target.files[0])
    });
    setIsPhotoChange(true);
    handlePhotoToBase64(e.target.files[0]);
  };

  const handlePhotoToBase64 = file => {
    var reader = new FileReader();
    if (file) {
      reader.readAsDataURL(file);
      reader.onload = () => {
        var Base64 = reader.result;
        var splitBase64 = Base64.split(',')[1];
        setFileBase64(splitBase64);
      };
      reader.onerror = error => {
        console.log('error', error);
      };
    }
  };

  const getRestrictedRole = () => {
    const userRole = roles.filter(item => (item === roleTypes.ErlAdmin) === false && (item === roleTypes.Manager) === false);
    const mangerRole = roles.filter(item => (item === roleTypes.ErlAdmin) === false);
    let localArray = [];
    if (authUser.role === roleTypes.User) {
      localArray = [...userRole];
      return localArray;
    } else if (authUser.role === roleTypes.Manager) {
      localArray = [...mangerRole];
      return localArray;
    } else {
      localArray = [...roles];
      return localArray;
    }
  };

  const getRestrictedCompany = params => {
    const userCompany = customers.filter(item => (item.value === authUser.companyId) === true);
    let customerArray = [];
    if (authUser.role === roleTypes.Manager || authUser.role === roleTypes.User) {
      customerArray = [...userCompany];
      return customerArray;
    } else {
      customerArray = [...customers];
      return customerArray;
    }
  };

  const handleClickShowPassword = () => {
    setIsPasswordShow({ ...isPasswordShow, show: !isPasswordShow.show });
  };

  const handleMouseDownPassword = event => {
    event.preventDefault();
  };

  const handleSubmit = event => {
    event.preventDefault();
    if (validate()) {
      var data = {
        role: roleName,
        firstName: values.firstName,
        lastName: values.lastName,
        companyId: authUser.role === roleTypes.Manager ? authUser.companyId : values.companyId,
        companyName: authUser.role === roleTypes.Manager ? authUser.companyName : values.companyName,
        email: values.email,
        userName: values.userName,
        password: values.password,
        confirmPassword: values.confirmPassword,
        profilePicture: fileBase64
      };

      //document.getElementById('jsonData').textContent = JSON.stringify(data, null, 2);

      axios
        .post(`${urls.account.users.post}`, data)
        .then(({ data }) => {
          if (data.succeeded) {
            alerts('success', `${data.message}`);
            props.history.replace('/accounts/user');
          } else {
            alerts('success', `${data.message}`);
          }
        })
        .catch(({ response }) => {
          alerts('error', `${response.data.title}`);
        });
    } else {
      alerts('error', 'Data Not Validated!!!');
    }
  };

  return (
    <PageContainer heading="New User" breadcrumbs={breadcrumbs}>
      <br />
      <br />
      <Form>
        <Paper className={classes.paper} elevation={3}>
          <Grid container>
            <Grid container item lg={8} sm={12} md={8}>
              <Grid item xs={12} sm={6} lg={6} md={6}>
                <TextInput
                  name="firstName"
                  label="First Name"
                  type="text"
                  value={values.firstName}
                  error={errors.firstName}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6} lg={6} md={6}>
                <TextInput
                  name="lastName"
                  label="Last Name"
                  type="text"
                  value={values.lastName}
                  error={errors.lastName}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6} lg={6} md={6}>
                <TextInput
                  name="userName"
                  type="text"
                  label="User Name"
                  value={values.userName}
                  error={errors.userName}
                  onChange={handleInputChange}
                />
              </Grid>

              <Grid item xs={12} sm={6} lg={6} md={6}>
                <TextInput
                  name="email"
                  type="email"
                  label="Email"
                  value={values.email}
                  error={errors.email}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} sm={6} lg={6} md={6}>
                <TextInput
                  name="password"
                  type={isPasswordShow.show ? 'text' : 'password'}
                  label=" Password"
                  value={values.password}
                  error={errors.password}
                  onChange={handleInputChange}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end">
                          {isPasswordShow.show ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} lg={6} md={6}>
                <TextInput
                  name="confirmPassword"
                  type={isPasswordShow.show ? 'text' : 'password'}
                  label="Confirm Password"
                  value={values.confirmPassword}
                  error={errors.confirmPassword}
                  onChange={handleInputChange}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end">
                          {isPasswordShow.show ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} lg={6} md={6}>
                <AutoCompleteSelector
                  controlId="tags-outlined"
                  options={getRestrictedRole()}
                  getOptionLabel={option => option}
                  value={roleName}
                  variant="filled"
                  placeholder="Select a Role"
                  filterSelectedOptions
                  onChange={(event, newValue) => {
                    handleMultipleRolesSelect(newValue);
                  }}
                />
              </Grid>
              {authUser.role !== roleTypes.Manager && (
                <Grid item xs={12} sm={6} lg={6} md={6}>
                  <Dropdown
                    label="Company"
                    disabled={authUser.role === roleTypes.Manager}
                    name="companyId"
                    options={getRestrictedCompany()}
                    value={authUser.role === roleTypes.Manager ? authUser.companyId : values.companyId}
                    onChange={e => {
                      handleCustomerChange(e);
                    }}
                  />
                </Grid>
              )}
            </Grid>
            <Grid container item xs={12} lg={4} sm={12} md={4}>
              <Box className={classes.photoBox}>
                <Box display="flex" alignItems="center" justifyContent="center" flexDirection={{ xs: 'column', sm: 'row' }}>
                  <CmtImage className={classes.avator} src={previewPhoto.image} />
                </Box>
                <Box
                  display="flex"
                  alignItems="center"
                  marginTop="2%"
                  justifyContent="center"
                  flexDirection={{ xs: 'column', sm: 'row' }}>
                  {!isPhotoChange ? (
                    <Button
                      className={classes.changeButton}
                      size="small"
                      variant="outlined"
                      onClick={() => {
                        setIsPhotoChange(true);
                      }}>
                      Add Photo
                    </Button>
                  ) : (
                    <Button
                      className={classes.cancelButton}
                      size="small"
                      variant="outlined"
                      onClick={() => {
                        setIsPhotoChange(false);
                        setPreviewPhoto({ image: null });
                      }}>
                      Cancel
                    </Button>
                  )}
                </Box>
                <Box
                  display="flex"
                  alignItems="center"
                  marginTop="2%"
                  justifyContent="center"
                  flexDirection={{ xs: 'column', sm: 'row' }}>
                  {isPhotoChange && (
                    <TextField
                      className={classes.photoChange}
                      size="small"
                      variant="outlined"
                      name="file"
                      onChange={handlePhotoChange}
                      type="file"
                    />
                  )}
                </Box>
              </Box>
            </Grid>
            <Grid container item xs={12} sm={12} md={12} lg={12} justify="flex-end">
              <SubmitButton
                onClick={e => {
                  handleSubmit(e);
                }}
                type="submit"
                text="Submit"
              />
              <ResetButton
                text="Reset"
                onClick={() => {
                  resetFormField();
                }}
              />
              <NavLink to="/accounts/user">
                <CancelButton />
              </NavLink>
            </Grid>
          </Grid>
        </Paper>
      </Form>
      <NotificationContainer />
      <pre id="jsonData"></pre>
    </PageContainer>
  );
}
