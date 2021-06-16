import {
  Box,
  Button,
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
  TableSortLabel,
  TextField,
  Typography
} from '@material-ui/core';
import { FilterListSharp, Refresh, Search } from '@material-ui/icons';
import AddIcon from '@material-ui/icons/Add';
import { Pagination } from '@material-ui/lab';
import { DatePicker } from '@material-ui/pickers';
import { roleTypes } from 'constants/RoleTypes';
import PageContainer from 'containers/PageComponents/layouts/PageContainer';
import { ConfirmDialog, Dropdown, GroupButtons, PopupSection } from 'customControls';
import { DeleteButton, EditButton, ViewButton } from 'customControls/ActionButtons/ActionButtons';
import Moment from 'moment';
import qs from 'querystring';
import React, { useEffect, useState } from 'react';
import { NotificationContainer } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import axios, { urls } from 'services/auth/jwt/config';
import { alerts } from 'utils/alert';
import ApproveOrderQuantity from './ApproveOrderQuantity';
import OrderPreview from './OrderPreview';

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
  { label: 'Orders', link: '/orders/list', isActive: true }
];

const status = [
  {
    value: 'all',
    label: 'All'
  },
  {
    value: 'isRejected',
    label: 'Rejected'
  },
  {
    value: 'isCompleted',
    label: 'Completed'
  },
  {
    value: 'isAccepted',
    label: 'Accepted'
  },
  {
    value: 'isReviewed',
    label: 'Reviewed'
  },
  {
    value: 'isDeleted',
    label: 'Deleted'
  }
];

export default function OrderList(props) {
  const classes = useStyles();
  const { authUser } = useSelector(({ auth }) => auth);
  const headCells = [
    { id: 'ReqOrderNumber', label: 'Request Order No' },
    { id: 'OrderNumber', label: 'Order Number' },
    { id: 'RequestDateAndTime', label: 'Request Date' },
    { id: 'customerName', label: 'Company' },
    { id: 'note', label: 'Note', disableSorting: true },
    { id: 'status', label: 'Status', disableSorting: true },
    { id: 'actions', label: 'Actions', disableSorting: true }
  ];
  const [records, setRecords] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [headCellState, setHeadCellState] = useState([]);

  const [isLoaded, setIsLoaded] = useState(false);

  const [recordForDetails, setrecordForDetails] = useState(null);
  const [openPreviewPopup, setOpenPreviewPopup] = useState(false);

  const [recordForQtyApprove, setRecordForQtyApprove] = useState(null);
  const [openQtyApprovePopup, setOpenQtyApprovePopup] = useState(false);

  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '' });

  const [isFilter, setIsFilter] = useState(false);

  const pages = [10, 15, 20];
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(pages[page]);
  const [dataLength, setDataLength] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [sortedBy, setSortedBy] = useState('desc');
  const [sortedColumn, setSortedColumn] = useState('Id');
  const [filterByOrderNo, setFilterByOrderNo] = useState('');
  const [filterByStatus, setFilterByStatus] = useState('');
  const [filterByReqOrderNo, setFilterByReqOrderNo] = useState('');
  const [filterByCompany, setFilterByCompany] = useState('');
  const [filterByRequestedDate, setFilterByRequestedDate] = useState({
    orderFromDate: '',
    orderToDate: ''
  });

  const [selectedDate, setSelectedDate] = useState({
    fromDate: new Date(),
    toDate: new Date()
  });

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

  const getAllOrders = async () => {
    const filterBody = {
      PageNumber: pageNumber,
      PageSize: rowsPerPage,
      SortedColumn: sortedColumn,
      SortedBy: sortedBy
    };

    if (filterByOrderNo !== '') {
      filterBody.OrderNumber = filterByOrderNo;
    }
    if (filterByReqOrderNo !== '') {
      filterBody.ReqOrderNumber = filterByReqOrderNo;
    }
    if (filterByStatus !== '') {
      filterBody.Status = filterByStatus;
    }

    if (filterByRequestedDate.orderFromDate !== '') {
      filterBody.OrderFromDate = Moment(filterByRequestedDate.orderFromDate).format('yy-MM-DD');
    }
    if (filterByRequestedDate.orderFromDate !== '') {
      filterBody.OrderToDate = Moment(filterByRequestedDate.orderToDate).format('yy-MM-DD');
    }

    try {
      await axios.get(`${urls.order.get_all}?${qs.stringify(filterBody)}`).then(res => {
        setRecords(res.data.data);
        setDataLength(res.data.totalCount);
        setIsLoaded(true);
      });
    } catch (e) {
      console.log(e);
    }
  };
  const handleFromDateChange = date => {
    setSelectedDate({ ...selectedDate, fromDate: date });
    setFilterByRequestedDate({
      ...filterByRequestedDate,
      orderFromDate: Moment(date).format('yy-MM-DD')
    });
  };
  const handleToDateChange = date => {
    setSelectedDate({ ...selectedDate, toDate: date });
    setFilterByRequestedDate({
      ...filterByRequestedDate,
      orderToDate: Moment(date).format('yy-MM-DD')
    });
  };

  const handleReset = async () => {
    setFilterByOrderNo('');
    setFilterByReqOrderNo('');
    setFilterByCompany('');
    setFilterByRequestedDate({
      orderFromDate: '',
      orderToDate: ''
    });
    setFilterByStatus('');
    /// After Filter State is empty
    const filterBody = {
      PageNumber: pageNumber,
      PageSize: rowsPerPage,
      SortedColumn: sortedColumn,
      SortedBy: sortedBy
    };

    try {
      await axios.get(`${urls.order.get_all}?${qs.stringify(filterBody)}`).then(res => {
        setRecords(res.data.data);
        setDataLength(res.data.totalCount);
        setIsLoaded(true);
      });
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getAllOrders();
    getAllCustomers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowsPerPage, pageNumber, sortedBy, sortedColumn]);

  const handleSearch = async () => {
    const filterBody = {
      PageNumber: pageNumber,
      PageSize: rowsPerPage,
      SortedColumn: sortedColumn,
      SortedBy: sortedBy
    };

    if (filterByOrderNo !== '') {
      filterBody.OrderNumber = filterByOrderNo;
    }
    if (filterByCompany !== '') {
      filterBody.customerId = filterByCompany;
    }
    if (filterByReqOrderNo !== '') {
      filterBody.ReqOrderNumber = filterByReqOrderNo;
    }
    if (filterByStatus !== '') {
      filterBody.Status = filterByStatus;
    }
    if (filterByRequestedDate.orderFromDate !== '') {
      filterBody.OrderFromDate = Moment(filterByRequestedDate.orderFromDate).format('yy-MM-DD');
    }
    if (filterByRequestedDate.orderFromDate !== '') {
      filterBody.OrderToDate = Moment(filterByRequestedDate.orderToDate).format('yy-MM-DD');
    }
    console.log(`${urls.order.get_all}?${qs.stringify(filterBody)}`);
    try {
      await axios
        .get(`${urls.order.get_all}?${qs.stringify(filterBody)}`)
        .then(res => {
          setRecords(res.data.data);
          setDataLength(res.data.totalCount);
        })
        .catch(({ response }) => {
          alerts('error', `${response.data.Message}`);
        });
    } catch (e) {
      console.log(e);
    }
  };

  //This is for Both Insert and update savePurchaseType
  const closePopup = () => {
    setrecordForDetails(null);
    setOpenPreviewPopup(false);
  };

  const closeApproveQtyPopup = () => {
    // setRecordForQtyApprove(null);
    setOpenQtyApprovePopup(false);
    getAllOrders();
  };

  const PreviewOrder = orderId => {
    if (orderId) {
      axios
        .get(`${urls.order.get_by_id}/${orderId}`)
        .then(({ data }) => {
          if (data.succeeded) {
            const body = data.data;
            setrecordForDetails(body);
            setOpenPreviewPopup(true);
          } else {
            alerts('warning', `${data.message}`);
          }
        })
        .catch(({ response }) => {
          alerts('error', `${response.data.Message}`);
        });
    }
  };

  const onEdit = orderId => {
    props.history.replace('/orders/edit', { orderId });
  };

  const onDelete = key => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false
    });
    axios
      .delete(`${urls.order.delete}/${key}`)
      .then(({ data }) => {
        if (data.succeeded) {
          alerts('success', 'Order Deleted!!!');
          getAllOrders();
        } else {
          alerts('warning', `${data.message}`);
        }
      })
      .catch(({ response }) => {
        alerts('error', `${response.data.Message}`);
      });
  };

  useEffect(() => {
    const logic = authUser.role === roleTypes.User || authUser.role === roleTypes.Manager;
    if (logic) {
      const values = [...headCells];
      values.splice(
        values.findIndex(item => item.id === 'customerName'),
        1
      );
      setHeadCellState(values);
    } else {
      setHeadCellState(headCells);
    }
  }, []);

  const getStatus = record => {
    const { isAccepted, isRejected, isConfirmed, isCompleted, orderNumber, isDeleted } = record;
    if (isRejected) {
      return {
        text: 'Rejected',
        bgcolor: '#E00930'
      };
    } else if (isDeleted) {
      return {
        text: 'Deleted',
        bgcolor: 'red'
      };
    } else if (orderNumber && isConfirmed && isAccepted && isCompleted) {
      return {
        text: 'Completed',
        bgcolor: '#4A9141'
      };
    } else if (!orderNumber && isConfirmed) {
      return {
        text: 'Requested',
        bgcolor: '#FF8C00'
      };
    } else if (orderNumber && isConfirmed && isAccepted) {
      return {
        text: 'Accepted',
        bgcolor: '#03DAC5'
      };
    } else if (orderNumber && isConfirmed) {
      return {
        text: 'Review',
        bgcolor: '#AAAAAA'
      };
    } else {
      return {
        text: 'Errror',
        bgcolor: 'red'
      };
    }
  };

  let tableContent = null;
  if (isLoaded) {
    tableContent = (
      <>
        <TableContainer className={classes.tContrainer} component={Paper}>
          <Table className={classes.table} size="small">
            <TableHead>
              <TableRow>
                {headCellState?.map(headCell => (
                  <TableCell key={headCell.id}>
                    {headCell.disableSorting ? (
                      headCell.label
                    ) : (
                      <TableSortLabel
                        active={sortedColumn === headCell.id}
                        direction={sortedColumn === headCell.id ? sortedBy : 'asc'}
                        onClick={() => {
                          handleSortRequest(headCell.id);
                        }}>
                        {headCell.label}
                      </TableSortLabel>
                    )}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {records?.map(record => (
                <TableRow key={record.id}>
                  <TableCell>{record.reqOrderNumber === null ? 'N/A' : record.reqOrderNumber}</TableCell>
                  <TableCell>{record.orderNumber === null ? 'Requested' : record.orderNumber}</TableCell>
                  <TableCell>{Moment(record.requestDateAndTime).format('DD-MMM-yyyy')}</TableCell>
                  {(authUser.role === roleTypes.SuperAdmin || authUser.role === roleTypes.ErlAdmin) && (
                    <TableCell>{record.customerName}</TableCell>
                  )}
                  <TableCell>{record.note}</TableCell>
                  <TableCell>
                    <Box className={classes.badgeRoot} component="span" bgcolor={getStatus(record).bgcolor}>
                      {getStatus(record).text}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <GroupButtons>
                      {authUser.role !== roleTypes.User && (
                        <>
                          {!record.isAccepted && (
                            <>
                              <EditButton
                                onClick={() => {
                                  onEdit(record.id);
                                }}
                              />
                              {!record.isDeleted && (
                                <DeleteButton
                                  onClick={() => {
                                    setConfirmDialog({
                                      isOpen: true,
                                      title: 'Are you sure to delete this record?',
                                      subTitle: "You cann't undo this operation",
                                      onConfirm: () => {
                                        onDelete(record.key);
                                      }
                                    });
                                  }}
                                />
                              )}
                            </>
                          )}
                        </>
                      )}
                      <ViewButton
                        title="View Order Details"
                        placement="top"
                        onClick={() => {
                          PreviewOrder(record.id);
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
    <PageContainer heading="Orders" breadcrumbs={breadcrumbs}>
      <NotificationContainer />
      <div className={classes.mainDiv}>
        <Grid container>
          {(authUser.role === roleTypes.User || authUser.role === roleTypes.Manager) && (
            <Grid xs item>
              <NavLink to="/orders/new">
                <Button variant="outlined" color="primary" size="small" endIcon={<AddIcon />}>
                  New
                </Button>
              </NavLink>
            </Grid>
          )}

          <Grid item xs container justify="flex-end">
            <Box className={classes.filterBox}>
              <Button
                style={{ marginLeft: '2rem' }}
                variant="outlined"
                color="primary"
                size="small"
                onClick={() => {
                  getAllOrders();
                }}
                endIcon={<Refresh />}>
                Refresh
              </Button>
              {!isFilter ? (
                <Button
                  style={{ marginLeft: '2rem' }}
                  variant="outlined"
                  color="primary"
                  size="small"
                  onClick={() => {
                    setIsFilter(true);
                  }}
                  endIcon={<FilterListSharp />}>
                  Filter
                </Button>
              ) : (
                <Button
                  variant="outlined"
                  color="primary"
                  size="small"
                  onClick={() => {
                    setIsFilter(false);
                  }}
                  endIcon={<FilterListSharp />}>
                  Cancel
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>
        {isFilter && (
          <Grid container direction="row" spacing={4}>
            <Grid item xs={12} sm={6} md={2} lg={2} xl={2}>
              <TextField
                fullWidth
                size="small"
                label="Request Order No"
                variant="outlined"
                value={filterByReqOrderNo}
                onChange={e => {
                  setFilterByReqOrderNo(e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2} lg={2} xl={2}>
              <TextField
                fullWidth
                size="small"
                label=" Order No"
                variant="outlined"
                value={filterByOrderNo}
                onChange={e => {
                  setFilterByOrderNo(e.target.value);
                }}
              />
            </Grid>
            {authUser.role !== roleTypes.User && authUser.role !== roleTypes.Manager && (
              <Grid item xs={12} sm={6} md={2} lg={2} xl={2}>
                <Dropdown
                  value={filterByCompany}
                  onChange={e => {
                    setFilterByCompany(e.target.value);
                  }}
                  variant="outlined"
                  label="Company Name"
                  options={customers}
                />
              </Grid>
            )}

            <Grid item xs={12} sm={6} md={2} lg={2} xl={2}>
              <Dropdown
                value={filterByStatus}
                onChange={e => {
                  setFilterByStatus(e.target.value);
                }}
                variant="outlined"
                label="Status"
                options={status}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3} lg={3} xl={3}>
              <Box display="flex" title="Hello">
                <Box mr={3}>
                  <DatePicker
                    fullWidth
                    className={classes.dateBox}
                    inputVariant="outlined"
                    size="small"
                    label="From Date"
                    format="yyyy-MM-DD"
                    value={selectedDate.fromDate}
                    onChange={handleFromDateChange}
                    animateYearScrolling
                  />
                </Box>
                <Box>
                  <DatePicker
                    className={classes.dateBox}
                    fullWidth
                    inputVariant="outlined"
                    size="small"
                    label="To Date"
                    format="yyyy-MM-DD"
                    value={selectedDate.toDate}
                    onChange={handleToDateChange}
                    animateYearScrolling
                  />
                </Box>
              </Box>
            </Grid>
            <Grid container item xs={12} sm={12} md={12} lg={12} xl={12} justify="flex-end">
              <Button
                type="Submit"
                className={classes.searchButton}
                variant="outlined"
                endIcon={<Search />}
                onClick={() => {
                  handleSearch();
                }}>
                Search
              </Button>
              <Button
                className={classes.searchButton}
                variant="outlined"
                onClick={() => {
                  handleReset();
                }}>
                Reset
              </Button>
            </Grid>
          </Grid>
        )}

        <br />
        <Grid container item xs={12} sm={12} md={12} lg={12} xl={12}>
          {tableContent}
        </Grid>

        <PopupSection title="Details" openPopup={openPreviewPopup} setOpenPopup={setOpenPreviewPopup}>
          <OrderPreview closePopup={closePopup} recordForDetails={recordForDetails} />
        </PopupSection>

        <PopupSection title="Quantity Approve" openPopup={openQtyApprovePopup} setOpenPopup={setOpenQtyApprovePopup}>
          <ApproveOrderQuantity closePopup={closeApproveQtyPopup} recordForQtyApprove={recordForQtyApprove} />
        </PopupSection>

        {/* <Notification notify={notify} setNotify={setNotify} /> */}

        <ConfirmDialog confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog} />
      </div>
    </PageContainer>
  );
}
