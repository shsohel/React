import {
  Button,
  LinearProgress,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@material-ui/core';
import { roleTypes } from 'constants/RoleTypes';
import PageContainer from 'containers/PageComponents/layouts/PageContainer';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios, { urls } from 'services/auth/jwt/config';

const useStyles = makeStyles(theme => ({
  mainDiv: {
    backgroundColor: 'white',
    justifyContent: 'center',
    padding: '25px'
  },
  table: {
    '& thead th': {
      fontWeight: 'bold',
      color: 'black',
      backgroundColor: '#C6C6C6'
    },
    '& tbody td': {
      fontWeight: 'normal'
    },
    '& tbody tr:hover': {
      backgroundColor: '#e8f4f8',
      cursor: 'pointer'
    }
  }
}));

const breadcrumbs = [
  { label: 'Home', link: '/' },
  { label: 'Roles', link: '/accounts/role', isActive: true }
];

const headCells = [
  { id: 'roleName', label: 'Role Name' },
  { id: 'actions', label: 'Actions', disableSorting: true }
];

export default function RoleList(props) {
  const classes = useStyles();
  const [records, setRecords] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const { authUser } = useSelector(({ auth }) => auth);

  const getAllRoles = async () => {
    try {
      await axios
        .get(`${urls.account.roles.get_all}`)
        .then(({ data }) => {
          setRecords(data);
          setIsLoaded(true);
        })
        .then(res => {});
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    getAllRoles();
  }, []);

  const onEdit = roleId => {
    props.history.push({ pathname: '/accounts/role/edit', state: { roleId: roleId } });
  };
  const getRestrictedRole = () => {
    const userRole = records.filter(
      item => (item.name === roleTypes.ErlAdmin) === false && (item.name === roleTypes.Manager) === false
    );
    const mangerRole = records.filter(item => (item.name === roleTypes.ErlAdmin) === false);
    let localArray = [];
    if (authUser.role === roleTypes.User) {
      localArray = [...userRole];
      return localArray;
    } else if (authUser.role === roleTypes.Manager) {
      localArray = [...mangerRole];
      return localArray;
    } else {
      localArray = [...records];
      return localArray;
    }
  };

  let tableContent = null;
  if (isLoaded) {
    tableContent = (
      <TableContainer component={Paper}>
        <Table className={classes.table} size="small">
          <TableHead>
            <TableRow>
              {headCells.map(headCell => (
                <TableCell key={headCell.id}>{headCell.label}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {getRestrictedRole().map(record => (
              <TableRow key={record.id}>
                <TableCell>{record.name}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    onClick={() => {
                      onEdit(record.id);
                    }}>
                    Manage Permission
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  } else {
    tableContent = <LinearProgress color="primary" />;
  }

  return (
    <PageContainer heading="Roles" breadcrumbs={breadcrumbs}>
      <div className={classes.mainDiv}>
        <br />
        <br />
        {tableContent}
      </div>
    </PageContainer>
  );
}
