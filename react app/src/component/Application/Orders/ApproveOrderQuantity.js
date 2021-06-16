import {
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField
} from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import { lighten, makeStyles } from '@material-ui/core/styles';
import GridContainer from 'containers/GridContainer';
import Moment from 'moment';
import React, { useState } from 'react';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import axios, { urls } from 'services/auth/jwt/config';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: lighten(theme.palette.background.paper, 0.1)
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

  noteField: {
    margin: theme.spacing(1),
    width: '100%',
    fontSize: '5px',
    fontWeight: 'bold'
  },
  tableHeading: {
    '& tbody td': {
      fontWeight: 'bold'
    },
    '& tbody tr:hover': {
      backgroundColor: '#e8f4f8',
      cursor: 'pointer'
    },
    padding: theme.spacing(2)
  }
}));
export default function ApproveOrderQuantity(props) {
  const classes = useStyles();
  const { closePopup, recordForQtyApprove } = props;
  //const [order, setOrder] = useState( recordForQtyApprove );
  const order = recordForQtyApprove;
  const [orderDetails, setOrderDetails] = useState(recordForQtyApprove.orderDetails);

  const handleDrumQtyChange = (key, e) => {
    const inputField = order.orderDetails.map(item => {
      if (key === item.key) {
        if (+e.target.value <= +item.numberOfDrumRequest) {
          item[e.target.name] = +e.target.value;
          item['quantityFinal'] = +(e.target.value * item.conversionRate).toFixed(2);
        } else {
          NotificationManager.warning('You reacched maximum drum!!!!');
          item[e.target.name] = 0;
          item['quantityFinal'] = 0;
        }
      }
      return item;
    });
    setOrderDetails(inputField);
  };

  const handleQtyChange = (key, e) => {
    const inputField = order.orderDetails.map(item => {
      if (key === item.key) {
        if (+e.target.value <= +item.quantityRequest) {
          item[e.target.name] = +e.target.value;
        } else {
          NotificationManager.warning('You reacched maximum quantity');
          item['quantityFinal'] = 0;
        }
      }
      return item;
    });
    setOrderDetails(inputField);
  };

  const handleSubmit = e => {
    e.preventDefault();
    const isConfirm = window.confirm('Are your sure you all the information?');
    if (isConfirm) {
      const body = {
        id: order.id,
        key: order.key,
        orderNumber: order.orderNumber,
        requestDateAndTime: order.requestDateAndTime,
        customerId: order.customerId,
        customerName: order.customerName,
        note: order.note,
        orderDetails
      };
      axios.put(`${urls.order.put}/${body.key}`, body).then(({ data }) => {
        if (data.succeeded) {
          closePopup();
        } else {
          NotificationManager.warning(data.message);
        }
      });
    }
  };

  return (
    <GridContainer>
      <NotificationContainer />
      <form>
        <Grid container item xs={12} sm={12} md={12} lg={12} spacing={2}>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <Table size="small" className={classes.tableHeading}>
              <TableBody>
                <TableRow>
                  <TableCell>Customer:</TableCell>
                  <TableCell style={{ fontSize: '16px' }}>{order.customerName}</TableCell>
                  <TableCell>Note:</TableCell>
                  <TableCell>{order.note}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Order Number:</TableCell>
                  <TableCell>{order.orderNumber}</TableCell>
                  <TableCell>Requested Date:</TableCell>
                  <TableCell>{Moment(order.requestDate).format('DD-MMM-yyyy')}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={12}>
            {orderDetails.length > 0 ? (
              <TableContainer component={Paper}>
                <Table size="small" className={classes.table} aria-label="a dense table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Product Info</TableCell>
                      <TableCell align="left">Packaging Type</TableCell>
                      <TableCell align="left">Initial Drum</TableCell>
                      <TableCell align="left">Initial Quantity</TableCell>
                      <TableCell align="left">Approved Drum</TableCell>
                      <TableCell align="left">Approved Quantity</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orderDetails.map(item => (
                      <TableRow key={item.id}>
                        <TableCell component="th" scope="row">
                          {item.productName} ({item.productGradeName})
                        </TableCell>
                        <TableCell align="left">{item.purchaseTypeName}</TableCell>
                        <TableCell align="left">{item.numberOfDrumRequest}</TableCell>
                        <TableCell align="left">
                          {item.quantityRequest} {item.unitName}{' '}
                        </TableCell>
                        <TableCell align="left">
                          <TextField
                            disabled={item.conversionRate === 0}
                            type="number"
                            name="numberOfDrumFinal"
                            value={item.numberOfDrumFinal}
                            onChange={e => {
                              handleDrumQtyChange(item.key, e);
                            }}
                            onFocus={e => {
                              e.target.select();
                            }}
                          />
                        </TableCell>
                        <TableCell align="left">
                          <TextField
                            disabled={item.conversionRate !== 0}
                            type="number"
                            name="quantityFinal"
                            value={item.quantityFinal}
                            onChange={e => {
                              handleQtyChange(item.key, e);
                            }}
                            onFocus={e => {
                              e.target.select();
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : null}
            <Grid container justify="flex-end" style={{ margin: '8px', padding: '8px' }}>
              <Button type="submit" variant="contained" color="primary" onClick={handleSubmit}>
                Submit
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </form>
    </GridContainer>
  );
}
