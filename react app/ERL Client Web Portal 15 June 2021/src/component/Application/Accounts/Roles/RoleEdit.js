import { CircularProgress, Tab, Tabs } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';
import PageContainer from 'containers/PageComponents/layouts/PageContainer';
import { Checkbox } from 'customControls';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import axios, { urls } from 'services/auth/jwt/config';
import { alerts } from 'utils/alert';
import { v4 as uuidv4 } from 'uuid';
import { CancelButton, SubmitButton } from '../../../../customControls/ActionButtons/ActionButtons';

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
  checkboxRoot: {
    display: 'flex'
  },
  formControl: {
    margin: theme.spacing(3)
  }
}));
const breadcrumbs = [
  { label: 'Home', link: '/' },
  { label: 'Roles', link: '/accounts/role', isActive: false },
  { label: 'Permission', link: '', isActive: true }
];
const RoleEdit = props => {
  const { location, history } = props;
  const { roleId } = location.state;
  const classes = useStyles();
  const [value, setValue] = useState(0);
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [permissions, setPermissions] = useState(null);

  const getRoleDetailsByRoleId = roleId => {
    axios.get(`${urls.account.permissions.get_all_by_roleId}?roleId=${roleId}`).then(res => {
      const permissionData = res.data;
      const splitedValues = [];
      permissionData.roleClaims.forEach(item => {
        item.checkBoxId = uuidv4();
        splitedValues.push(item.value.split('.')[1]);
      });
      const uniqueValues = [...new Set(splitedValues)];
      const modifiePermissiondObj = {
        roleId: permissionData.roleId,
        roleClaims: uniqueValues.map(item => ({
          valueId: uuidv4(),
          valueType: item,
          valueArray: permissionData.roleClaims.filter((fileredItem, index, arr) => fileredItem.value.split('.')[1] === item)
        }))
      };
      setPermissions(modifiePermissiondObj);
      setIsPageLoaded(true);
    });
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    getRoleDetailsByRoleId(roleId);
  }, []);

  if (!isPageLoaded) {
    return (
      <Box className={classes.circularProgressRoot}>
        <CircularProgress />
      </Box>
    );
  }

  const onPermissionChange = (e, valueId, checkBoxId) => {
    const { name, checked } = e.target;
    const updatedPermissions = permissions.roleClaims.map(item => {
      if (valueId === item.valueId) {
        item.valueArray.map(gp => {
          if (checkBoxId === gp.checkBoxId) {
            gp[name] = checked;
          }
          return gp;
        });
      }
      return item;
    });
    setPermissions({ ...permissions, roleClaims: updatedPermissions });
  };

  const handleCancel = () => {
    history.push({ pathname: '/accounts/role' });
  };

  const onSubmit = e => {
    e.preventDefault();
    const filteredObjects = [];
    permissions.roleClaims.map(gp =>
      gp.valueArray.map(sp => {
        if (sp.selected) {
          delete sp.checkBoxId;
          filteredObjects.push(sp);
        }
        return sp;
      })
    );
    const reqObj = {
      roleId: permissions.roleId,
      roleClaims: filteredObjects
    };
    axios
      .put('/api/Permission', reqObj)
      .then(res => {
        alerts('success', 'Permission changed!!!');
        // alerts("");
        history.push({ pathname: '/accounts/role' });
      })
      .catch(err => alerts('error', 'There was an error!! Plese contact with your reporting manager'));
  };

  return (
    <>
      <PageContainer heading="Role Permission" breadcrumbs={breadcrumbs}>
        <Box className={classes.root}>
          <Tabs
            orientation="vertical"
            variant="scrollable"
            value={value}
            onChange={handleChange}
            aria-label="Vertical tabs example"
            className={classes.tabs}>
            {permissions.roleClaims.map((item, index) => (
              <Tab key={index + 1} label={item?.valueType} {...a11yProps(index)} />
            ))}
          </Tabs>

          {permissions.roleClaims.map((groupPermission, index) => (
            <TabPanel value={value} index={index} key={index + 1} label={groupPermission.type} {...a11yProps(index)}>
              {groupPermission.valueArray.map((item, index) => (
                <Checkbox
                  checked={item.selected}
                  name="selected"
                  onChange={e => {
                    onPermissionChange(e, groupPermission.valueId, item.checkBoxId);
                  }}
                  key={index + 1}
                  label={item.value.split('.')[2]}
                />
              ))}
            </TabPanel>
          ))}
        </Box>
        <Box display="flex" justifyContent="flex-end">
          <SubmitButton onClick={onSubmit} />
          <CancelButton
            onClick={() => {
              handleCancel();
            }}
          />
        </Box>
      </PageContainer>

      <pre id="jsonData"></pre>
    </>
  );
};

export default RoleEdit;
