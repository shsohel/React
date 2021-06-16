import CmtAvatar from '@coremat/CmtAvatar';
import {
  Box,
  FormControl,
  Grid,
  LinearProgress,
  makeStyles,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import PageContainer from 'containers/PageComponents/layouts/PageContainer';
import { ConfirmDialog, GroupButtons, PopupSection } from 'customControls';
import { EditButton, InActiveButton, NewButton, PasswordButton } from 'customControls/ActionButtons/ActionButtons';
import qs from 'querystring';
import React, { useEffect, useState } from 'react';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import axios, { urls } from 'services/auth/jwt/config';
import { alerts } from 'utils/alert';
import ResetPasswordByAdmin from './ResetPasswordByAdmin';
const imageDataType = 'data:image/png;base64';
const useStyles = makeStyles(theme => ({
  mainDiv: {
    backgroundColor: 'white',
    justifyContent: 'center',
    padding: '25px'
  },
  formControl: {
    marginRight: theme.spacing(2),
    minWidth: 120,
    fontWeight: 50
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
  },
  filterBox: {
    marginBottom: theme.spacing(3),

    fontWeight: 'bold'
  },
  dateBox: {
    fontWeight: 'bold',
    marginRight: theme.spacing(3)
  },
  searchButton: {
    marginLeft: theme.spacing(3)
  },
  tContrainer: {
    marginBottom: theme.spacing(3)
  },
  badgeRoot: {
    color: theme.palette.common.white,
    borderRadius: 30,
    fontSize: 12,
    padding: '2px 10px',
    display: 'inline-block'
  }
}));

const breadcrumbs = [
  { label: 'Home', link: '/' },
  { label: 'Users', link: '/accounts/user', isActive: true }
];

const headCells = [
  { id: 'userName', label: 'User Name' },
  { id: 'fullName', label: 'Full Name' },
  { id: 'email', label: 'Email' },
  { id: 'companyName', label: 'Company' },
  { id: 'photo', label: 'Photo', disableSorting: true },
  { id: 'actions', label: 'Actions', disableSorting: true }
];

const userStatus = [
  {
    value: 'enabled',
    label: 'Active'
  },
  {
    value: 'disabled',
    label: 'Inactive'
  },
  {
    value: 'all',
    label: 'All'
  }
];

export default function UserList(props) {
  const classes = useStyles();
  const [records, setRecords] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '' });
  const pages = [10, 15, 20];
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(pages[page]);
  const [dataLength, setDataLength] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [sortedBy, setSortedBy] = useState('asc');
  const [sortedColumn, setSortedColumn] = useState('Id');

  const [filterByStatus, setFilterByStatus] = useState('enabled');
  const [searchData, setSearchData] = useState([]);
  const [openPopup, setOpenPopup] = useState(false);
  const [recordForPassword, setrecordForPassword] = useState([]);

  const { authUser } = useSelector(({ auth }) => auth);
  const handleChangePage = (event, pageNumber) => {
    setPage(pageNumber);
    setPageNumber(pageNumber);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value));
    setPage(0);
  };

  const handleSortRequest = cellId => {
    const isAsc = sortedColumn === cellId && sortedBy === 'asc';
    setSortedBy(isAsc ? 'desc' : 'asc');
    setSortedColumn(cellId);
  };
  const getAllUsers = async () => {
    const filterBody = {
      PageNumber: pageNumber,
      PageSize: rowsPerPage,
      SortedColumn: sortedColumn,
      SortedBy: sortedBy
    };
    try {
      await axios.get(`${urls.account.users.get_all_users}?${qs.stringify(filterBody)}`).then(res => {
        if (filterByStatus === 'enabled') {
          setRecords(res.data.data.filter(item => item.isActive === true));
        } else if (filterByStatus === 'disabled') {
          setRecords(res.data.data.filter(item => item.isActive === false));
        } else {
          setRecords(res.data.data);
        }
        setDataLength(res.data.totalCount);
        setIsLoaded(true);
      });
    } catch (e) {
      console.log(e);
    }
  };
  const handleStatusChange = event => {
    setFilterByStatus(event.target.value);
  };

  useEffect(() => {
    getAllUsers();
  }, [rowsPerPage, pageNumber, sortedBy, sortedColumn, filterByStatus]);

  const onDelete = id => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false
    });
    axios.delete(`${urls.account.users.delete_user_by_userId}/${id}`).then(({ data }) => {
      if (data.succeeded) {
        NotificationManager.success(data.message);
        getAllUsers();
      } else {
        NotificationManager.error(data.message);
      }
    });
  };

  const handleEdit = async userId => {
    if (userId) {
      await axios.get(`${urls.account.users.get_user_by_userId}/${userId}`).then(({ data }) => {
        props.history.replace('/accounts/user-update', data.data);
      });
    } else {
    }
  };

  const openInPopup = user => {
    setrecordForPassword({
      userName: user.userName,
      id: user.id
    });
    setOpenPopup(true);
  };

  const handleResetPassword = async resetData => {
    try {
      await axios
        .post(`${urls.account.users.password_reset_by_Admin}`, resetData)
        .then(({ data }) => {
          if (data.succeeded) {
            alerts('success', `${data.message}`);
            setOpenPopup(false);
          } else {
            alerts('error', `${data.message}`);
          }
        })
        .catch(({ response }) => {
          alerts('error', `${response.data.Message}`);
        });
    } catch (error) {}
    //setrecordForPassword(null);
  };

  let tableContent = null;
  if (isLoaded) {
    tableContent = (
      <>
        <TableContainer className={classes.tContrainer} component={Paper}>
          <Table size="small" className={classes.table}>
            <TableHead>
              <TableRow>
                {headCells.map(headCell => (
                  <TableCell key={headCell.id}>{headCell.label}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {records?.map(record => (
                <TableRow key={record.id}>
                  <TableCell>{record.userName}</TableCell>
                  <TableCell>
                    {record.firstName} {record.lastName}
                  </TableCell>
                  <TableCell>{record.email}</TableCell>
                  <TableCell>{record.companyName}</TableCell>
                  <TableCell>
                    <CmtAvatar src={`${imageDataType},${record?.profilePicture}`} />{' '}
                  </TableCell>
                  <TableCell>
                    <GroupButtons>
                      <EditButton
                        onClick={() => {
                          handleEdit(record.id);
                        }}
                      />
                      {record.isActive && (
                        <InActiveButton
                          onClick={() => {
                            setConfirmDialog({
                              isOpen: true,
                              title: 'Are you sure to inactive this record?',
                              subTitle: "You cann't undo this operation",
                              onConfirm: () => {
                                onDelete(record.id);
                              }
                            });
                          }}
                        />
                      )}

                      <PasswordButton
                        onClick={() => {
                          openInPopup(record);
                        }}
                      />
                    </GroupButtons>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Grid container item xs={12} sm={12} md={12} lg={4} justify="flex-start">
          <FormControl className={classes.formControl}>
            <Typography> Row Per Page : </Typography>
          </FormControl>
          <FormControl className={classes.formControl}>
            <Select id="select-label-row" value={rowsPerPage} onChange={handleChangeRowsPerPage}>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={15}>15</MenuItem>
              <MenuItem value={20}>20</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid container item xs={12} sm={12} md={12} lg={8} justify="flex-end">
          <Pagination
            count={Math.ceil(dataLength / rowsPerPage)}
            // count={20}
            variant="outlined"
            color="primary"
            onChange={handleChangePage}
            showFirstButton
            showLastButton
          />
        </Grid>
      </>
    );
  } else {
    tableContent = <LinearProgress color="primary" />;
  }

  return (
    <PageContainer heading="Users" breadcrumbs={breadcrumbs}>
      <div className={classes.mainDiv}>
        <NotificationContainer />
        <Grid container>
          <Grid xs item>
            <NavLink to="/accounts/user-new">
              <NewButton />
            </NavLink>
          </Grid>
          <Grid item xs container justify="flex-end">
            <Box style={{ width: '200px' }}>
              <TextField
                className={classes.textField}
                size="small"
                fullWidth
                id="search-by-status"
                select
                label="Search by Status"
                value={filterByStatus}
                onChange={e => {
                  handleStatusChange(e);
                }}
                variant="outlined"
                SelectProps={{
                  native: true
                }}>
                {userStatus.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </TextField>
            </Box>
          </Grid>
        </Grid>
        <br />
        <Grid container item xs={12} sm={12} md={12} lg={12} xl={12}>
          {tableContent}
        </Grid>

        <PopupSection title="Password Reset" openPopup={openPopup} setOpenPopup={setOpenPopup}>
          <ResetPasswordByAdmin recordForPassword={recordForPassword} handleResetPassword={handleResetPassword} />
        </PopupSection>

        <ConfirmDialog confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog} />
      </div>
    </PageContainer>
  );
}
