import CmtAvatar from '@coremat/CmtAvatar';
import CmtCard from '@coremat/CmtCard';
import CmtCardContent from '@coremat/CmtCard/CmtCardContent';
import { Box, Button, fade, Grid, TextField } from '@material-ui/core';
import { blue } from '@material-ui/core/colors';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { EditAttributesOutlined, Link, MailOutline, TitleRounded } from '@material-ui/icons';
import clsx from 'clsx';
import GridContainer from 'containers/GridContainer';
import PageContainer from 'containers/PageComponents/layouts/PageContainer';
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import axios, { urls } from 'services/auth/jwt/config';
import { alerts } from 'utils/alert';
const imageDataType = 'data:image/png;base64';

const useStyles = makeStyles(theme => ({
  cardRoot: {
    padding: theme.spacing(5)
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
    padding: theme.spacing(5)
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
  { label: 'Profile', link: '/accounts/profile' },
  { label: 'Updating', link: '', isActive: true }
];

const ProfileUpdate = props => {
  const classes = useStyles();
  const { authUser } = props.location.state;
  const [fileBase64, setFileBase64] = useState('');
  const [isPhotoChange, setIsPhotoChange] = useState(false);

  const imageUrl = `${imageDataType},${authUser?.profilePicture}`;
  const [previewPhoto, setPreviewPhoto] = useState({ image: imageUrl });
  const [user, setUser] = useState({
    id: authUser.id,
    firstName: authUser.firstName,
    lastName: authUser.lastName
  });

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
  const handleSubmit = () => {
    const body = {
      id: authUser.id,
      firstName: user.firstName,
      lastName: user.lastName,
      profilePicture: fileBase64 !== '' ? fileBase64 : authUser?.profilePicture
    };

    axios.put(`${urls.account.users.put}`, body).then(({ data }) => {
      if (data.succeeded) {
        alerts('success', 'Profile Updated Successfully!!!');
        window.location.href = '/accounts/profile';
      } else {
        alerts('success', `${data.message}`);
      }
    });
  };

  return (
    <PageContainer heading="Profile Update" breadcrumbs={breadcrumbs}>
      <CmtCard className={classes.cardRoot}>
        <CmtCardContent>
          <GridContainer>
            <Grid item xs={12} md={7} xl={6}>
              <Box className={classes.vectorMapRoot}>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  marginTop="2%"
                  marginBottom="2%"
                  flexDirection={{ xs: 'column', sm: 'row' }}>
                  <CmtAvatar className={classes.avator} size={300} src={previewPhoto.image} />
                </Box>
                <Box
                  display="flex"
                  alignItems="center"
                  marginBottom="2%"
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
                      onClick={e => {
                        setIsPhotoChange(false);
                        setPreviewPhoto({ image: imageUrl });
                        setFileBase64('');
                      }}>
                      Cancel
                    </Button>
                  )}
                </Box>
                {isPhotoChange && (
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    flexDirection={{ xs: 'column', sm: 'row' }}>
                    <TextField size="small" variant="outlined" name="file" onChange={handlePhotoChange} type="file" />
                  </Box>
                )}
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
                      {authUser?.userName}
                    </Box>
                  </Box>
                </Box>
                <Box display="flex" alignItems="center" mb={{ xs: 4, sm: 6 }}>
                  <Box className={classes.iconView}>
                    <EditAttributesOutlined />
                  </Box>
                  <Box ml={5}>
                    <Box ml={5}>
                      <Box
                        component="div"
                        display="flex"
                        className={classes.wordAddress}
                        fontSize={16}
                        color="text.secondary">
                        <TextField
                          className={classes.password}
                          size="small"
                          type="text"
                          label="First Name"
                          variant="outlined"
                          name="firstName"
                          value={user.firstName}
                          onChange={e => {
                            setUser({ ...user, firstName: e.target.value });
                          }}
                        />
                        <TextField
                          className={classes.password}
                          size="small"
                          type="text"
                          label="Last Name"
                          variant="outlined"
                          name="firstName"
                          value={user.lastName}
                          onChange={e => {
                            setUser({ ...user, lastName: e.target.value });
                          }}
                        />
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
                      <Box component="a" href={`mailto:${authUser?.email}`}>
                        {authUser?.email}
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Grid>
            <Grid container item xs={12} md={12} xl={12} justify="flex-end">
              <Box display="flex">
                <Box ml={2}>
                  <Button size="small" color="primary" variant="outlined" onClick={handleSubmit}>
                    Update
                  </Button>
                </Box>
                <Box ml={2}>
                  <NavLink to="/accounts/profile">
                    <Button size="small" color="primary" variant="outlined">
                      Cancel
                    </Button>
                  </NavLink>
                </Box>
              </Box>
            </Grid>
          </GridContainer>
        </CmtCardContent>
      </CmtCard>
      <pre id="jsonData"></pre>
    </PageContainer>
  );
};

export default ProfileUpdate;
