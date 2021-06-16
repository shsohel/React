import CmtImage from '@coremat/CmtImage';
import { Box, Button, Grid, Paper, TextField, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { roleTypes } from 'constants/RoleTypes';
import PageContainer from 'containers/PageComponents/layouts/PageContainer';
import { AutoCompleteSelector, Checkbox, TextInput } from 'customControls';
import { CancelButton, SubmitButton } from 'customControls/ActionButtons/ActionButtons';
import React, { useEffect, useState } from 'react';
import { NotificationContainer } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import axios, { urls } from 'services/auth/jwt/config';
import { alerts } from 'utils/alert';
import { Form, useForm } from 'utils/useForm';
const imageDataType = 'data:image/png;base64';

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
  { label: 'Updating', link: 'accounts/user-update', isActive: true }
];

export default function UserForm(props) {
  const classes = useStyles();
  const dataEdit = props.history.location.state;
  const { authUser } = useSelector(({ auth }) => auth);
  const [isPhotoChange, setIsPhotoChange] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [fileBase64, setFileBase64] = useState('');

  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    if ('userName' in fieldValues) temp.userName = fieldValues.userName ? '' : 'This fields is requird';
    if ('employeeID' in fieldValues) temp.employeeID = fieldValues.employeeID ? '' : 'This fields is requird';
    if ('fullName' in fieldValues) temp.fullName = fieldValues.fullName ? '' : 'This fields is requird';
    if ('email' in fieldValues) temp.email = fieldValues.email ? '' : 'This fields is requird';
    if ('jobTitle' in fieldValues) temp.jobTitle = fieldValues.jobTitle ? '' : 'This fields is requird';
    if ('phoneNumber' in fieldValues) temp.phoneNumber = fieldValues.phoneNumber ? '' : 'This fields is requird';
    setErrors({
      ...temp
    });
    if (fieldValues === values) return Object.values(temp).every(x => x === '');
  };
  const { values, setValues, errors, setErrors, resetForm, handleInputChange } = useForm(dataEdit, true, validate);

  ///Start Photo State and Handle
  const imageUrl = `${imageDataType},${dataEdit?.profilePicture}`;
  const [previewPhoto, setPreviewPhoto] = useState({ image: imageUrl });

  const handlePhotoChange = e => {
    setPreviewPhoto({
      image: URL.createObjectURL(e.target.files[0])
    });
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

  ///Photo State and Handle End
  const [roleName, setRoleName] = useState(dataEdit.role);
  const [roles, setRoles] = useState([]);
  const [passwordChange, setPasswordChange] = useState({
    currentPassword: '',
    newPassword: ''
  });
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

  useEffect(() => {
    getAllCustomers();
    getAllRoles();
  }, []);

  const handleMultipleRolesSelect = roles => {
    setRoleName(roles);
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

  const handleSubmit = event => {
    event.preventDefault();
    var data = {
      id: values.id,
      role: roleName,
      firstName: values.firstName,
      lastName: values.lastName,
      companyId: values.companyId,
      companyName: values.companyName,
      email: values.email,
      userName: values.userName,
      profilePicture: fileBase64 !== '' ? fileBase64 : dataEdit?.profilePicture,
      isActive: values.isActive
    };

    axios.put(`${urls.account.users.put}`, data).then(({ data }) => {
      if (data.succeeded) {
        alerts('success', 'User Updated Successfully!!!');
        props.history.replace('/accounts/user');
      } else {
        alerts('success', `${data.message}`);
      }
    });
    //document.getElementById('jsonData').textContent = JSON.stringify(data, null, 2);
  };

  return (
    <PageContainer heading="Edit User" breadcrumbs={breadcrumbs}>
      <br />
      <br />
      <Form onSubmit={handleSubmit}>
        <Paper className={classes.paper} elevation={3}>
          <Grid container spacing={3}>
            <Grid container item lg={8} sm={12} md={8} spacing={3}>
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
                  disabled
                  type="text"
                  label="Email"
                  value={values.email}
                  error={errors.email}
                  onChange={handleInputChange}
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
              <Grid item xs={12} sm={6} lg={6} md={6}>
                <Box display="flex">
                  <Box m={2}>
                    <Typography> Is Active? </Typography>
                  </Box>
                  <Box>
                    <Checkbox
                      name="isActive"
                      checked={values.isActive}
                      onChange={e => setValues({ ...values, isActive: e.target.checked })}
                    />
                  </Box>
                </Box>
              </Grid>
            </Grid>
            <Grid container item xs={12} lg={4} sm={12} md={4} justify="center">
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
                      Change Photo
                    </Button>
                  ) : (
                    <Button
                      className={classes.cancelButton}
                      size="small"
                      variant="outlined"
                      onClick={() => {
                        setIsPhotoChange(false);
                        setPreviewPhoto({ image: imageUrl });
                        setFileBase64('');
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
              <NavLink to="/accounts/user">
                <CancelButton />
              </NavLink>
            </Grid>
          </Grid>
        </Paper>
      </Form>
      <pre id="jsonData"></pre>

      <NotificationContainer />
    </PageContainer>
  );
}
