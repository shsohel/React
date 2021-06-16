import CmtAvatar from '@coremat/CmtAvatar';
import CmtCard from '@coremat/CmtCard';
import CmtCardContent from '@coremat/CmtCard/CmtCardContent';
import { Box, Button, fade, IconButton, InputAdornment, TextField } from '@material-ui/core';
import blue from '@material-ui/core/colors/blue';
import Grid from '@material-ui/core/Grid';
import makeStyles from '@material-ui/core/styles/makeStyles';
import {
  EditAttributesOutlined,
  Link,
  Lock,
  MailOutline,
  TitleRounded,
  Visibility,
  VisibilityOff
} from '@material-ui/icons';
import clsx from 'clsx';
import { CurrentAuthMethod } from 'constants/AppConstants';
import GridContainer from 'containers/GridContainer';
import PageContainer from 'containers/PageComponents/layouts/PageContainer';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AuhMethods } from 'services/auth';
import axios, { urls } from 'services/auth/jwt/config';
import { alerts } from 'utils/alert';
const imageDataType = 'data:image/png;base64';

const useStyles = makeStyles(theme => ({
  cardRoot: {
    padding: theme.spacing(4)
  },
  textUppercase: {
    textTransform: 'uppercase'
  },
  vectorMapRoot: {
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
    border: 'solid 2px',
    borderColor: '#C6C6C6',
    padding: theme.spacing(4)
  },
  avator: {
    border: 'solid 2px',
    borderColor: '#C6C6C6'
  },

  ///Contact Info
  iconView: {
    backgroundColor: fade(blue['500'], 0.1),
    color: blue['500'],
    padding: 8,
    borderRadius: 4,
    '& .MuiSvgIcon-root': {
      display: 'block'
    },

    '&.username': {
      backgroundColor: fade(theme.palette.warning.main, 0.1),
      color: theme.palette.warning.main
    },
    '&.phone': {
      backgroundColor: fade(theme.palette.success.main, 0.15),
      color: theme.palette.success.dark
    },

    '&.jobtile': {
      backgroundColor: fade(theme.palette.success.main, 0.15),
      color: theme.palette.success.dark
    },
    '&.email': {
      backgroundColor: fade(theme.palette.warning.main, 0.1),
      color: theme.palette.warning.main
    }
  },

  wordAddress: {
    wordBreak: 'break-all',
    cursor: 'pointer'
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
  password: {
    margin: '0.8rem'
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
  changePassButton: {
    marginLeft: '0.8rem',
    marginTop: '0.2rem',
    color: 'green'
  }
}));

const breadcrumbs = [
  { label: 'Home', link: '/' },
  { label: 'Profile', link: '', isActive: true }
];

const ProfileView = props => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const { authUser } = useSelector(({ auth }) => auth);
  const [isChangePassword, setIsChangePassword] = useState(false);
  const [passwordChange, setPasswordChange] = useState({
    userName: authUser.userName,
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isPasswordShow, setIsPasswordShow] = useState({
    show: false
  });
  const handleClickShowPassword = () => {
    setIsPasswordShow({ ...isPasswordShow, show: !isPasswordShow.show });
  };

  const handleMouseDownPassword = event => {
    event.preventDefault();
  };

  const handleChangePassword = () => {
    // document.getElementById('jsonData').textContent = JSON.stringify(passwordChange, null, 2);
    axios
      .post(`${urls.account.users.change_password}`, passwordChange)
      .then(({ data }) => {
        if (data.succeeded) {
          alerts('success', 'Password Changed Successfully');
          dispatch(AuhMethods[CurrentAuthMethod].onLogout());
        } else {
          alerts('success', `${data.message}`);
        }
      })
      .catch(({ response }) => {
        alerts('error', `${response.data.Message}`);
      });
  };

  return (
    <PageContainer heading="Profile" breadcrumbs={breadcrumbs}>
      {authUser && (
        <CmtCard className={classes.cardRoot}>
          <CmtCardContent>
            <GridContainer>
              <Grid item xs={12} md={7} xl={6}>
                <Box className={classes.vectorMapRoot}>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    marginTop="5%"
                    marginBottom="10%"
                    flexDirection={{ xs: 'column', sm: 'row' }}>
                    <CmtAvatar className={classes.avator} size={300} src={`${imageDataType},${authUser?.profilePicture}`} />
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} md={5} xl={6}>
                <Box className={classes.vectorMapRoot}>
                  <Box display="flex" alignItems="center" mb={{ xs: 4, sm: 6 }}>
                    <Box className={clsx(classes.iconView, 'jobtile')}>
                      <TitleRounded />
                    </Box>
                    <Box ml={5}>
                      <Box component="span" fontSize={12} color="text.primary">
                        Comany
                      </Box>
                      <Box className={classes.wordAddress} fontSize={16}>
                        <Box component="p" className={classes.wordAddress} fontSize={16} color="text.secondary">
                          {authUser?.companyName}
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                  <Box display="flex" alignItems="center" mb={{ xs: 4, sm: 6 }}>
                    <Box className={clsx(classes.iconView, 'username')}>
                      <Link />
                    </Box>
                    <Box ml={5}>
                      <Box component="span" fontSize={12} color="text.secondary">
                        User Name
                      </Box>
                      <Box component="p" className={classes.wordAddress} fontSize={16} color="text.secondary">
                        {authUser.userName}
                      </Box>
                    </Box>
                  </Box>
                  <Box display="flex" alignItems="center" mb={{ xs: 4, sm: 6 }}>
                    <Box className={classes.iconView}>
                      <EditAttributesOutlined />
                    </Box>
                    <Box ml={5}>
                      <Box component="span" fontSize={12} color="text.secondary">
                        Name
                      </Box>
                      <Box component="p" className={classes.wordAddress} fontSize={16}>
                        <Box component="a">
                          {authUser?.firstName} {authUser?.lastName}
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                  <Box display="flex" alignItems="center" mb={{ xs: 4, sm: 6 }}>
                    <Box className={clsx(classes.iconView, 'email')}>
                      <MailOutline />
                    </Box>
                    <Box ml={5}>
                      <Box component="span" fontSize={12} color="text.secondary">
                        Email
                      </Box>
                      <Box component="p" className={classes.wordAddress} fontSize={16}>
                        <Box component="a" href={`mailto:${authUser.email}`}>
                          {authUser?.email}
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                  {!isChangePassword ? (
                    <Button
                      className={classes.changeButton}
                      size="small"
                      variant="outlined"
                      onClick={() => {
                        setIsChangePassword(true);
                      }}>
                      Change Password
                    </Button>
                  ) : (
                    <Box display="flex" alignItems="center" mb={{ xs: 4, sm: 6 }}>
                      <Box className={clsx(classes.iconView, 'phone')}>
                        <Lock />
                      </Box>
                      <Box ml={5}>
                        <Box component="span" fontSize={12} color="text.secondary">
                          Password Change
                        </Box>
                        <Box className={classes.wordAddress} fontSize={16} color="text.primary">
                          <TextField
                            className={classes.password}
                            size="small"
                            type={isPasswordShow.show ? 'text' : 'password'}
                            label="Current Password"
                            variant="outlined"
                            name="currentPassword"
                            value={passwordChange.currentPassword}
                            onChange={e => {
                              setPasswordChange({ ...passwordChange, currentPassword: e.target.value });
                            }}
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
                          <TextField
                            className={classes.password}
                            size="small"
                            type={isPasswordShow.show ? 'text' : 'password'}
                            label="New Password"
                            variant="outlined"
                            name="currentPassword"
                            value={passwordChange.password}
                            onChange={e => {
                              setPasswordChange({ ...passwordChange, newPassword: e.target.value });
                            }}
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
                          <TextField
                            className={classes.password}
                            size="small"
                            type={isPasswordShow.show ? 'text' : 'password'}
                            label="Confirm Password"
                            variant="outlined"
                            name="confirmPassword"
                            value={passwordChange.confirmPassword}
                            onChange={e => {
                              setPasswordChange({ ...passwordChange, confirmPassword: e.target.value });
                            }}
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
                        </Box>
                        <Box>
                          <Button
                            className={classes.cancelButton}
                            size="small"
                            variant="outlined"
                            onClick={() => {
                              setIsChangePassword(false);
                              setPasswordChange({ currentPassword: '', newPassword: '' });
                            }}>
                            Cancel
                          </Button>
                          <Button
                            className={classes.changePassButton}
                            size="small"
                            variant="outlined"
                            onClick={() => {
                              handleChangePassword();
                            }}>
                            Change Password
                          </Button>
                        </Box>
                      </Box>
                    </Box>
                  )}
                </Box>
              </Grid>
              <Grid container item xs={12} md={12} xl={12} justify="flex-end">
                <Button
                  size="small"
                  color="primary"
                  variant="outlined"
                  onClick={() => {
                    props.history.replace('/accounts/profile-update', { authUser });
                  }}>
                  Edit
                </Button>
              </Grid>
            </GridContainer>
          </CmtCardContent>
        </CmtCard>
      )}
    </PageContainer>
  );
};

export default ProfileView;
