import { CircularProgress } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import { Checkbox } from 'customControls';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import axios, { urls } from 'services/auth/jwt/config';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}>
      {value === index && (
        <Box p={3}>
          <Box>{children}</Box>
        </Box>
      )}
    </Box>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`
  };
}

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    height: 300
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`
  }
}));

export default function TabTest() {
  const classes = useStyles();
  const [value, setValue] = useState(0);
  const [permissions, setPermissions] = useState([]);
  const [isPageLoaded, setPageIsLoaded] = useState(false);
  const [getRoleById, setGetRoleById] = useState('');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  ///For Permission
  const getAllPermissions = async () => {
    try {
      await axios.get(`${urls.account.permissions.get_all}`).then(({ data }) => {
        // setPermissions([
        //   {
        //     value: 'permissions',
        //     label: 'Permissions',
        //     children: data.map(item => ({
        //       value: item.groupName,
        //       label: item.groupName,
        //       children: item.permissions.map(item => ({
        //         value: item,
        //         label: item.split('.')[2]
        //       }))
        //     }))
        //   }
        // ]);
        setPermissions(data);
        //setPageIsLoaded(true);
      });
    } catch (e) {
      console.log(e);
    }
  };
  const getRolebyId = async () => {
    const roleId = 'cdfda4d3-ea1a-4662-a611-2d2e52b772b0';
    try {
      await axios.get(`${urls.account.roles.get_by_Id}/${roleId}`).then(({ data }) => {
        setGetRoleById(data);
        setPageIsLoaded(true);
      });
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    getAllPermissions();
    getRolebyId();
  }, []);

  if (!isPageLoaded) {
    return (
      <Box className={classes.circularProgressRoot}>
        <CircularProgress />
      </Box>
    );
  }

  //   console.log(getRoleById);
  ///End Premitions

  //    {
  //     "groupName": "User",
  //     "permissions": [
  //       "Permissions.Users.View",
  //       "Permissions.Users.Create",
  //       "Permissions.Users.Edit",
  //       "Permissions.Users.Delete"
  //     ]
  //   },

  //   {
  //   "id": "cdfda4d3-ea1a-4662-a611-2d2e52b772b0",
  //   "name": "ABP Manager",
  //   "description": "ABP Manager",
  //   "usersCount": 4,
  //   "isActive": false,
  //   "permissions": [
  //     "Permissions.LiftingSchedules.View",
  //     "Permissions.LiftingSchedules.Create",
  //     "Permissions.LiftingSchedules.Edit",
  //     "Permissions.LiftingSchedules.Delete",
  //     "Permissions.Loading.View",
  //     "Permissions.Loading.Edit",
  //     "Permissions.Loading.Cancel",
  //     "Permissions.SecurityChecks.EntryPermitCheck",
  //     "Permissions.SecurityChecks.ExitPermitCheck",
  //     "Permissions.Reports.DailyReport",
  //     "Permissions.Dashboard.CustomerDeliverySummary",
  //     "Permissions.StockManagement.StockAdjustment",
  //     "Permissions.StockManagement.View",
  //     "Permissions.Dashboard.ABPDashboard",
  //     "Permissions.Loading.PlaceLodedWeight",
  //     "Permissions.Loading.PlaceEmptyWeight",
  //     "Permissions.Products.View",
  //     "Permissions.PackagingTypes.View",
  //     "Permissions.ProductGrades.View",
  //     "Permissions.ConfirmationToken.Create"
  //   ]
  // }
  let flatPermissions = permissions.map(e => e['permissions']).flat();

  let result = getRoleById.permissions.map(i => flatPermissions.includes(i));
  console.log(
    getRoleById?.permissions.map(roleItem => roleItem === permissions.map(item => item.permissions.map(item => item)))
  );
  //   console.log(getRoleById.permissions instanceof Array);

  return (
    <Box className={classes.root}>
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        className={classes.tabs}>
        {permissions.map((item, index) => (
          <Tab key={index + 1} label={item.groupName} {...a11yProps(index)} />
        ))}
      </Tabs>

      {permissions.map((item, index) => (
        <TabPanel value={value} index={index} key={index + 1} label={item.groupName} {...a11yProps(index)}>
          {item.permissions.map((item, index) => (
            <Checkbox
              checked={getRoleById?.permissions.map(roleItem => roleItem === item) ? true : false}
              key={index + 1}
              label={item.split('.')[2]}
            />
          ))}
        </TabPanel>
      ))}
    </Box>
  );
}
