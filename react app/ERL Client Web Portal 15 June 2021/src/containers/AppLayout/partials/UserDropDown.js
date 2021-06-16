import CmtAvatar from '@coremat/CmtAvatar';
import CmtDropdownMenu from '@coremat/CmtDropdownMenu';
import { Box, fade, makeStyles, Typography } from '@material-ui/core';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import PersonIcon from '@material-ui/icons/Person';
import clsx from 'clsx';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AuhMethods } from 'services/auth';
import { CurrentAuthMethod } from '../../../constants/AppConstants';
const imageDataType = 'data:image/png;base64';

const useStyles = makeStyles(theme => ({
  profileRoot: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 10,
    position: 'relative',
    [theme.breakpoints.up('md')]: {
      paddingLeft: 20
    },
    '&:before': {
      content: '""',
      position: 'absolute',
      left: 0,
      top: 2,
      zIndex: 1,
      height: 35,
      width: 1,
      backgroundColor: fade(theme.palette.common.dark, 0.15)
    }
  },
  userName: {
    paddingLeft: 10
  }
}));

const actionsList = [
  {
    icon: <PersonIcon />,
    label: 'Profile'
  },
  {
    icon: <ExitToAppIcon />,
    label: 'Logout'
  }
];

const UserDropDown = () => {
  const classes = useStyles();
  const { authUser } = useSelector(({ auth }) => auth);
  const { userToken } = useSelector(({ auth }) => auth);
  console.log(userToken);
  const dispatch = useDispatch();

  const onItemClick = item => {
    if (item.label === 'Logout') {
      dispatch(AuhMethods[CurrentAuthMethod].onLogout());
    }
    if (item.label === 'Profile') {
      window.location.href = '/accounts/profile';
    }
  };

  return (
    <Box className={clsx(classes.profileRoot, 'Cmt-profile-pic')}>
      <CmtDropdownMenu
        onItemClick={onItemClick}
        TriggerComponent={<CmtAvatar className={classes.avator} src={`${imageDataType},${authUser?.profilePicture}`} />}
        items={actionsList}
      />
      <Typography className={classes.userName} display="block" variant="subtitle1">
        {authUser?.firstName} {authUser?.lastName}
      </Typography>
    </Box>
  );
};

export default UserDropDown;
