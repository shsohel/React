import {
  Box,
  Button,
  ButtonGroup,
  Collapse,
  fade,
  FormControl,
  Grid,
  IconButton,
  lighten,
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
  Typography
} from '@material-ui/core';
import { blue } from '@material-ui/core/colors';
import { Add, ArrowDownwardOutlined, ArrowUpwardOutlined } from '@material-ui/icons';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { Pagination } from '@material-ui/lab';
import PageContainer from 'containers/PageComponents/layouts/PageContainer';
import { ConfirmDialog, PopupSection } from 'customControls';
import { DeleteIcon } from 'customControls/ActionButtons/ActionButtons';
import React, { useEffect, useState } from 'react';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { useSelector } from 'react-redux';
import axios, { urls } from 'services/auth/jwt/config';
import ApprovalProcessForm from './ApprovalProcessForm';

const useRowStyles = makeStyles({
  root: {
    '& > *': {
      borderBottom: 'unset'
    }
  }
});

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: lighten(theme.palette.background.paper, 0.1)
  },
  mainDiv: {
    backgroundColor: 'white',
    justifyContent: 'center',
    padding: '25px'
  },
  table: {
    backgroundColor: fade(blue['500'], 0.1),
    '& thead th': {
      fontWeight: 'bold',
      color: 'black',
      backgroundColor: '#C6C6C6'
    },
    '& tbody td': {
      fontWeight: 'normal'
    },
    '& tbody tr': {
      fontWeight: 'bold',
      backgroundColor: fade('#C6C6C6', 0.1),
      fontStyle: 'oblique'
    },
    '& tbody tr:hover': {
      backgroundColor: fade('#C76300', 0.1),
      cursor: 'pointer'
    },
    '& tbody tr:active': {
      backgroundColor: '#FF8C00'
    },
    '& table thead th': {
      backgroundColor: fade(theme.palette.primary.main, 0.15),
      cursor: 'pointer'
    },
    '& table tbody tr': {
      fontWeight: 'bold',
      fontStyle: 'normal',
      backgroundColor: fade(theme.palette.warning.main, 0.15),
      color: theme.palette.success.main
    }
  },
  formControl: {
    marginRight: theme.spacing(2),
    minWidth: 120,
    fontWeight: 50
  },
  tContainer: {
    marginBottom: theme.spacing(3)
  }
}));

const breadcrumbs = [
  { label: 'Home', link: '/' },
  { label: 'Approval Processes', link: '/accounts/approval-process', isActive: true }
];

const ApprovalProcessDetailsData = props => {
  const { row, getAllApprovalProcesses, confirmDialog, setConfirmDialog } = props;
  const [open, setOpen] = useState(false);
  const classes = useRowStyles();

  const { userPermission } = useSelector(({ auth }) => auth);

  const postionLevelUp = item => {
    const upBody = {
      id: item.id,
      key: item.key,
      isUp: true
    };
    axios.post(`${urls.approvalProcess.post_position_config}/${item.key}`, upBody).then(({ data }) => {
      if (data.succeeded) {
        NotificationManager.success(data.message);
        getAllApprovalProcesses();
      } else {
        NotificationManager.error(data.message);
      }
    });
  };

  const postionLevelDown = item => {
    const downBody = {
      id: item.id,
      key: item.key,
      isUp: false
    };
    axios.post(`${urls.approvalProcess.post_position_config}/${item.key}`, downBody).then(({ data }) => {
      if (data.succeeded) {
        NotificationManager.success(data.message);
        getAllApprovalProcesses();
      } else {
        NotificationManager.error(data.message);
      }
    });
  };

  const onDelete = key => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false
    });
    axios.delete(`${urls.approvalProcess.delete}/${key}`).then(({ data }) => {
      if (data.succeeded) {
        NotificationManager.success(data.message);
        getAllApprovalProcesses();
      } else {
        NotificationManager.error(data.message);
      }
    });
  };

  return (
    <>
      <TableRow className={classes.root} onClick={() => setOpen(!open)}>
        <TableCell>
          <IconButton aria-label="expand row" size="small">
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row" style={{ fontWeight: 'bold', fontSize: '18px' }}>
          {row.groupName}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
          <Collapse in={open} style={{ backgroundColor: 'white' }} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Table size="small" aria-label="lifting">
                <TableHead>
                  <TableRow>
                    <TableCell>SL</TableCell>
                    <TableCell>User Name</TableCell>
                    <TableCell>Position Name</TableCell>
                    <TableCell>Position</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.approvalProcess.map((item, index) => (
                    <TableRow key={item.id} hover>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{item.userName}</TableCell>
                      <TableCell>{item.positionName}</TableCell>
                      <TableCell>
                        <ButtonGroup size="small" variant="contained">
                          <Button
                            disabled={index === 0}
                            style={{
                              backgroundColor: index === 0 ? '#D5D5D5' : 'white'
                            }}
                            onClick={() => {
                              postionLevelUp(item);
                            }}>
                            <ArrowUpwardOutlined
                              style={{
                                color: index === 0 ? 'black' : 'green'
                              }}
                            />
                          </Button>
                          <Button
                            disabled={index === row.approvalProcess.length - 1}
                            style={{
                              backgroundColor: index === row.approvalProcess.length - 1 ? '#D5D5D5' : 'white'
                            }}
                            onClick={() => {
                              postionLevelDown(item);
                            }}>
                            <ArrowDownwardOutlined
                              style={{
                                color: index === row.approvalProcess.length - 1 ? 'black' : 'red'
                              }}
                            />
                          </Button>
                        </ButtonGroup>
                      </TableCell>
                      <TableCell>
                        <DeleteIcon
                          title="Delete Approval Process"
                          placement="top"
                          onClick={() => {
                            setConfirmDialog({
                              isOpen: true,
                              title: 'Are you sure to delete this record?',
                              subTitle: 'You cannot undo this operation',
                              onConfirm: () => {
                                onDelete(item.key);
                              }
                            });
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default function LiftingScheduleList(props) {
  const classes = useStyles();
  const [openPopup, setOpenPopup] = useState(false);
  const [approvalProcesses, setApprovalProcesses] = useState([]);
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '' });

  const pages = [10, 15, 20];
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(pages[page]);
  const [dataLength, setDataLength] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);

  const { userPermission } = useSelector(({ auth }) => auth);

  const handleChangePage = (event, pageNumber) => {
    setPage(pageNumber);
    setPageNumber(pageNumber);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value));
    setPage(0);
  };

  const getAllApprovalProcesses = async () => {
    try {
      await axios
        .get(`${urls.approvalProcess.get_all}?PageNumber=${pageNumber}&PageSize=${rowsPerPage}`)
        .then(({ data }) => {
          if (data.succeeded) {
            const body = data.data;
            setApprovalProcesses(body);
            setDataLength(data.totalNoOfRow);
            setIsPageLoaded(true);
          }
        });
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    // getAllApprovalProcesses();
  }, [rowsPerPage, pageNumber]);

  // if (!isPageLoaded) {
  //   return (
  //     <Box className={classes.circularProgressRoot}>
  //       <CircularProgress />
  //     </Box>
  //   );
  // }

  const saveApprovalProcess = (approvalProcess, resetForm) => {
    axios.post(`${urls.approvalProcess.post}`, approvalProcess).then(({ data }) => {
      if (data.succeeded) {
        NotificationManager.success('Created Successfully Done!!!');
        getAllApprovalProcesses();
      } else {
        NotificationManager.error('Something Gonna Wrong!!!');
      }
    });
    resetForm();
    setOpenPopup(false);
  };

  return (
    <div>
      <PageContainer heading="Approval Processes" breadcrumbs={breadcrumbs}>
        <div className={classes.mainDiv}>
          <NotificationContainer />
          <Button
            size="small"
            onClick={() => {
              setOpenPopup(true);
            }}
            variant="outlined"
            color="primary"
            endIcon={<Add />}>
            New
          </Button>
          <br />
          <br />
          <Grid container item xs={12} sm={12} md={12} lg={12} justify="center">
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <>
                <TableContainer component={Paper} className={classes.tContainer}>
                  <>
                    <Table className={classes.table} size="small" aria-label="collapsible table">
                      <TableBody>
                        {approvalProcesses.map((row, index) => (
                          <ApprovalProcessDetailsData
                            confirmDialog={confirmDialog}
                            setConfirmDialog={setConfirmDialog}
                            key={row.groupName}
                            row={row}
                            propsRoute={props}
                            sl={index + 1}
                            getAllApprovalProcesses={getAllApprovalProcesses}
                          />
                        ))}
                      </TableBody>
                    </Table>
                  </>
                </TableContainer>
              </>
            </Grid>
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
          </Grid>
          <PopupSection title="Approval Process Form" openPopup={openPopup} setOpenPopup={setOpenPopup}>
            <ApprovalProcessForm saveApprovalProcess={saveApprovalProcess} />
          </PopupSection>
          <ConfirmDialog confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog} />
        </div>
      </PageContainer>
    </div>
  );
}
