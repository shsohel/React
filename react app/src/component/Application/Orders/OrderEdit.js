import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField
} from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import { ClearOutlined, DoneOutline, EditOutlined } from '@material-ui/icons';
import PageContainer from 'containers/PageComponents/layouts/PageContainer';
import { ConfirmDialog } from 'customControls';
import Moment from 'moment';
import qs from 'querystring';
import React, { useEffect, useState } from 'react';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { NavLink } from 'react-router-dom';
import axios, { urls } from 'services/auth/jwt/config';
import { alerts } from 'utils/alert';
import { v4 as uuidv4 } from 'uuid';

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(5),
    width: '95%'
  },
  selectEmpty: {
    marginTop: theme.spacing(6)
  },
  paper: {
    padding: theme.spacing(6),
    color: theme.palette.text.secondary,
    minWidth: '50px'
  },
  textField: {
    marginTop: theme.spacing(1),
    marginLeft: theme.spacing(5),
    marginRight: theme.spacing(5),
    width: '100%'
  },
  noteField: {
    marginTop: theme.spacing(-3),
    marginLeft: theme.spacing(5),
    marginRight: theme.spacing(5),
    width: '100%'
  },
  headTitle: {
    marginLeft: theme.spacing(6),
    marginTop: theme.spacing(6),
    marginRight: theme.spacing(-2),
    width: '100%',
    backgroundColor: '#C6C6C6',
    borderRadius: '5px',
    padding: 0
  },
  btnAdd: {
    marginRight: theme.spacing(-4)
  },

  textFieldNote: {
    margin: theme.spacing(6),
    width: '90%'
  },
  checkBoxControl: {
    margin: theme.spacing(5),
    width: '90%',
    paddingLeft: theme.spacing(2)
  },
  addRemoveAction: {
    margin: theme.spacing(5),
    width: '90%',
    paddingLeft: theme.spacing(2)
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
  tableContainer: {
    marginLeft: theme.spacing(6)
  },
  btnSubmitDiv: {
    marginLeft: theme.spacing(4)
  },
  addBtnDiv: {
    marginRight: theme.spacing(-8)
  }
}));

const breadcrumbs = [
  { label: 'Order', link: '/orders/list' },
  { label: 'Edit', link: 'orders/edit', isActive: true }
];

const initialFieldValues = {
  productId: '',
  productName: '',
  productGradeId: '',
  productGradeName: '',
  unitId: '',
  unitName: '',
  gradeId: '',
  purchaseTypeId: '',
  numberOfDrumRequest: 0,
  quantityRequest: 0,
  numberOfDrumFinal: 0,
  quantityFinal: 0
};

const InitialMasterValue = {
  //   id: order.id,
  // key: order.key,
  // orderNumber: order.orderNumber,
  // requestDateAndTime: Moment(selectedDate).format('yyyy-MM-DD hh:mm A'),
  // customerId: order.customerId,
  // customerName: order.customerName,
  // note: order.note,
  id: 0,
  key: '',
  orderNumber: '',
  customerId: '',
  customerName: '',
  note: '',
  orderDetails: []
};

export default function OrderForm(props) {
  const classes = useStyles();
  const orderId = props.location.state.orderId;
  const [orderDetails, setOrderDetails] = useState([]);
  const [products, setProducts] = useState([]);
  const [grades, setGrades] = useState([]);
  //const [unit, setUnit] = useState([]);
  //const [gradeName, setGradeName] = useState([]);
  const [purchaseTypes, setPurchaseTypes] = useState([]);
  const [purchaseType, setPurchaseType] = useState({});
  const [perUnitPrice, setPerUnitPrice] = useState(0);
  const [conversionValue, setConversionValue] = useState(0);
  const [editable, setEditable] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '' });
  const [open, setOpen] = useState(false);
  const [selectedDate, handleDateChange] = useState(new Date());
  const [order, setOrder] = useState(initialFieldValues);
  const [orderMaster, setOrderMaster] = useState(InitialMasterValue);
  async function getOrderwithDetailsbyKey() {
    try {
      await axios.get(`${urls.order.get_order_for_edit}/${orderId}`).then(({ data }) => {
        if (data.succeeded) {
          const body = data.data;
          handleDateChange(body.requestDateAndTime);
          setOrderMaster({
            ...orderMaster,
            id: body.id,
            key: body.key,
            orderNumber: body.orderNumber,
            customerId: body.customerId,
            customerName: body.customerName,
            note: body.note,
            orderDetails: body.orderDetails
          });
          setOrderDetails(
            body.orderDetails.map(item => ({
              ...orderDetails,
              fieldId: uuidv4(),
              id: item.id,
              key: item.key,
              orderId: item.orderId,
              orderNumber: item.orderNumber,
              perUnitPrice: item.perUnitPrice,
              productGradeId: item.productGradeId,
              productGradeName: item.productGradeName,
              productId: item.productId,
              productName: item.productName,
              purchaseTypeId: item.purchaseTypeId,
              purchaseTypeName: item.purchaseTypeName,
              numberOfDrumFinal: item.numberOfDrumFinal,
              numberOfDrumRequest: item.numberOfDrumRequest,
              quantityFinal: item.quantityFinal,
              quantityRequest: item.quantityRequest,
              unitId: item.unitId,
              unitName: item.unitName,
              conversionRate: item.conversionRate
            }))
          );
        } else {
          NotificationManager.error(data.message);
        }
      });
    } catch (error) {
      NotificationManager.warning('Something Wrong from Server!!!');
    }
  }

  async function getAllProdcut() {
    await axios
      .get(urls.products.get_all_products)
      .then(res => {
        const body = res.data.data;
        setProducts(
          body.map(item => ({
            label: item.nameEN,
            value: item.id,
            unitId: item.unitId,
            unitName: item.unitName
          }))
        );
      })
      .catch();
  }

  async function getAllPurchaseType() {
    await axios
      .get(urls.purchaseType.get_all_purchaseType)
      .then(res => {
        const body = res.data.data;
        setPurchaseTypes(
          body.map(item => ({
            label: item.name,
            value: item.id,
            key: item.key,
            purchaseTypeName: item.name,
            hasConversion: item.hasConversion,
            unitId: item.unitId
          }))
        );
      })
      .catch();
  }

  useEffect(() => {
    getOrderwithDetailsbyKey();
    getAllProdcut();
    getAllPurchaseType();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleProductChange = e => {
    if (e.target.value === '') {
      setOrder({ ...order, productId: '', productName: '', unitId: '', unitName: '' });
      return;
    }
    const selectedProduct = products.find(item => item.value === e.target.value);
    setOrder({
      ...order,
      productId: e.target.value,
      productName: selectedProduct.label,
      unitId: selectedProduct.unitId,
      unitName: selectedProduct.unitName
    });
    getGradesByProductId(e.target.value);
  };

  const getGradesByProductId = productId => {
    if (productId === '') {
      setGrades([]);
      return;
    }
    axios.get(`${urls.products.get_product_grade_by_productId}/${productId}`).then(({ data }) => {
      if (data.data.length) {
        const body = data.data;
        setGrades(
          body.map(item => ({
            label: item.nameEN,
            value: item.id
          }))
        );
      } else {
        alerts('warning', 'Selected Product has no grade!!!');
        setGrades([]);
      }
    });
  };

  const handleGradeChange = e => {
    if (e.target.value === '') {
      return;
    }
    const selectedGrade = e.target.value === '' ? null : grades.find(item => item.value === e.target.value);
    setOrder({
      ...order,
      productGradeId: selectedGrade.value,
      productGradeName: selectedGrade.label,
      purchaseTypeId: ''
    });
  };

  const handlePurchaseType = e => {
    if (e.target.value === '') {
      return;
    }
    const selectedPurchaseType = purchaseTypes.find(item => item.value === e.target.value);
    setPurchaseType(selectedPurchaseType);
    setOrder({
      ...order,
      purchaseTypeId: e.target.value,
      numberOfDrumFinal: 0,
      quantityFinal: 0
    });
    if (selectedPurchaseType.hasConversion) {
      getUnitCoversionValue(selectedPurchaseType);
    } else {
      setConversionValue(0);
    }
    getPerUnitPrice(selectedPurchaseType);
  };

  const getUnitCoversionValue = async purchaseType => {
    const queryStringForUnitConversionValue = {
      fromUnitId: purchaseType.unitId,
      toUnitId: order.unitId,
      gradeId: order.productGradeId
    };

    try {
      await axios
        .get(`${urls.productUnitConversion.get_unit_conversion_value}?${qs.stringify(queryStringForUnitConversionValue)}`)
        .then(res => {
          const body = res.data.data;
          setConversionValue(body);
        });
    } catch (error) {
      alerts('warning', 'Seletected Grades has no Unit Converstion!!!');
    }
  };

  const getPerUnitPrice = purchaseType => {
    const queryStringForProductGradePrice = {
      gradeId: order.productGradeId,
      purchaseTypeId: purchaseType.value
    };
    axios
      .get(`${urls.productPriceConfiguration.get_by_grade_and_packageType}?${qs.stringify(queryStringForProductGradePrice)}`)
      .then(({ data }) => {
        if (data.succeeded) {
          setPerUnitPrice(data.data.perUnitPrice);
        } else {
          setOrder({ ...order, productGradeId: '', productName: '', purchaseTypeId: '' });
          alerts('warning', 'Selected Grades has not price configuration!!!');
        }
      })
      .catch(({ response }) => {
        // alerts('error', `${response.data.Message}`);
        alerts('error', 'Price not found for this product');
      });
  };

  const handleAddFields = () => {
    if (
      order.productId &&
      order.productGradeId &&
      order.purchaseTypeId &&
      (order.numberOfDrumRequest || order.quantityRequest)
    ) {
      const similarItemIndex = orderDetails.findIndex(
        item =>
          item.productId === order.productId &&
          item.productGradeId === order.productGradeId &&
          item.purchaseTypeId === order.purchaseTypeId
      );
      if (similarItemIndex > -1) {
        setOpen(true);
      } else {
        setOrderDetails([
          ...orderDetails,
          {
            fieldId: uuidv4(),
            id: 0,
            orderId: order.id,
            orderNumber: order.orderNumber,
            productId: order.productId,
            productName: order.productName,
            productGradeId: order.productGradeId,
            productGradeName: order.productGradeName,
            purchaseTypeId: order.purchaseTypeId,
            purchaseTypeName: purchaseType.purchaseTypeName,
            numberOfDrumRequest: order.numberOfDrumRequest ? order.numberOfDrumRequest : 0,
            quantityRequest: order.quantityRequest ? order.quantityRequest : 0,
            numberOfDrumFinal: order.numberOfDrumFinal,
            quantityFinal: order.quantityFinal,
            unitId: order.unitId,
            unitName: order.unitName,
            perUnitPrice: perUnitPrice,
            conversionRate: conversionValue
          }
        ]);
        setOrder(initialFieldValues);
      }
    } else {
      alerts('warning', 'Please define order information first!!!');
    }
  };

  const handleRemoveFields = item => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false
    });

    const values = [...orderDetails];
    const sliceBody = values.splice(
      values.findIndex(value => value.fieldId === item.fieldId),
      1
    );
    setOrderDetails(values);
    const removeOrderDetailsKey = sliceBody[0].key;

    if (removeOrderDetailsKey) {
      axios
        .delete(`${urls.order.delete_order_details_by_key}/${removeOrderDetailsKey}`)
        .then(({ data }) => {
          if (data.succeeded) {
            alerts('success', 'Order Details Removed Successfully!!!');
          } else {
            alerts('warning', `${data.message}`);
          }
        })
        .catch(({ response }) => {
          alerts('error', `${response.data.Message}`);
        });
    }
  };

  const handleEnableEdit = () => {
    setEditable(!editable);
  };

  const handleInputChange = (fieldId, e) => {
    const newInputField = orderDetails.map(item => {
      if (fieldId === item.fieldId) {
        item[e.target.name] = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
      }
      return item;
    });
    setOrderDetails(newInputField);
  };

  const handleConvertion = (fieldId, e) => {
    const newInputField = orderDetails.map(item => {
      if (fieldId === item.fieldId) {
        item['numberOfDrumRequest'] = Number(e.target.value);
        item['quantityRequest'] = item.conversionRate * Number(e.target.value);
      }
      return item;
    });
    setOrderDetails(newInputField);
  };

  const handleSubmit = e => {
    e.preventDefault();
    const body = {
      id: orderMaster.id,
      key: orderMaster.key,
      orderNumber: orderMaster.orderNumber,
      requestDateAndTime: Moment(selectedDate).format('yyyy-MM-DD hh:mm A'),
      customerId: orderMaster.customerId,
      customerName: orderMaster.customerName,
      note: orderMaster.note,
      orderDetails
    };

    axios
      .put(`${urls.order.put}`, body)
      .then(({ data }) => {
        if (data.succeeded) {
          alerts('success', 'Order Updated Successfully!!!');

          props.history.replace('/orders/list');
        } else {
          alerts('warning', `${data.message}`);
        }
      })
      .catch(({ response }) => {
        alerts('error', `${response.data.Message}`);
      });
    //  document.getElementById('jsonData').textContent = JSON.stringify(body, null, 2);
  };

  const mergeAmount = () => {
    // if same item already in have OderDetails
    const similarItemIndex = orderDetails.findIndex(
      item =>
        item.productId === order.productId &&
        item.productGradeId === order.productGradeId &&
        item.purchaseTypeId === order.purchaseTypeId
    );
    const updatedOrderDetails = [...orderDetails];
    if (updatedOrderDetails[similarItemIndex].numberOfDrumRequest > 0) {
      updatedOrderDetails[similarItemIndex] = {
        ...updatedOrderDetails[similarItemIndex],
        numberOfDrumRequest: updatedOrderDetails[similarItemIndex].numberOfDrumRequest + order.numberOfDrumRequest,
        quantityRequest: updatedOrderDetails[similarItemIndex].quantityRequest + order.quantityRequest
      };
    } else {
      updatedOrderDetails[similarItemIndex] = {
        ...updatedOrderDetails[similarItemIndex],
        quantityRequest: updatedOrderDetails[similarItemIndex].quantityRequest + order.quantityRequest
      };
    }
    setOrderDetails(updatedOrderDetails);
    setOrder(initialFieldValues);
    setOpen(false);
  };
  const mergedDisagree = () => {
    setOrder(initialFieldValues);
    setOpen(false);
  };

  return (
    <PageContainer heading="Editing Order" breadcrumbs={breadcrumbs}>
      <NotificationContainer />
      <br />
      <br />
      <form>
        <Paper className={classes.paper} elevation={3}>
          <Grid container direction="column" justify="center" spacing={3}>
            <Grid container item xs={12} sm={12} md={12} lg={12} xl={12} spacing={6}>
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12} className={classes.headTitle}>
                <h2 style={{ textAlign: 'center' }}>Order Details</h2>
              </Grid>
              <Grid item xs={12} sm={12} md={3} lg={3}>
                <TextField
                  className={classes.textField}
                  id="ddlProduct"
                  select
                  label="Product"
                  value={order.productId}
                  onChange={e => {
                    handleProductChange(e);
                  }}
                  variant="outlined"
                  size="small">
                  <MenuItem value="">NONE</MenuItem>
                  {products.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={12} md={3} lg={3}>
                <TextField
                  disabled={!order.productId}
                  className={classes.textField}
                  id="ddlGrade"
                  select
                  label="Grade"
                  value={order.productGradeId}
                  onChange={e => {
                    handleGradeChange(e);
                  }}
                  variant="outlined"
                  size="small">
                  <MenuItem value="">NONE</MenuItem>
                  {grades.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={12} md={3} lg={3}>
                <TextField
                  disabled={!order.productGradeId}
                  className={classes.textField}
                  id="ddlPurchaseType"
                  select
                  label="Packaging Type"
                  value={order.purchaseTypeId}
                  onChange={e => {
                    handlePurchaseType(e);
                  }}
                  variant="outlined"
                  size="small">
                  <MenuItem value="">NONE</MenuItem>
                  {purchaseTypes.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={12} md={3} lg={3}>
                {purchaseType.hasConversion ? (
                  <TextField
                    size="small"
                    className={classes.textField}
                    disabled={!order.purchaseTypeId}
                    type="number"
                    variant="outlined"
                    margin="normal"
                    name="numberOfDrumRequest"
                    label={
                      'Number of ' + purchaseTypes !== {} ? purchaseType.purchaseTypeName + ' Quanity' : purchaseTypes.label
                    }
                    value={order.numberOfDrumRequest}
                    onChange={e => {
                      setOrder({
                        ...order,
                        numberOfDrumRequest: Number(e.target.value),
                        quantityRequest: Number((e.target.value * conversionValue).toFixed(3))
                      });
                    }}
                    onFocus={e => {
                      e.target.select();
                    }}
                  />
                ) : (
                  <TextField
                    size="small"
                    className={classes.textField}
                    disabled={!order.purchaseTypeId}
                    type="number"
                    variant="outlined"
                    margin="normal"
                    name="quantityRequest"
                    label={!order.purchaseTypeId ? 'Quantity' : purchaseType.purchaseTypeName + ' Quanity'}
                    value={order.quantityRequest}
                    onChange={e => {
                      setOrder({ ...order, quantityRequest: Number(e.target.value) });
                    }}
                    onFocus={e => {
                      e.target.select();
                    }}
                  />
                )}
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <TextField
                  className={classes.noteField}
                  variant="outlined"
                  multiline
                  size="small"
                  margin="normal"
                  name="note"
                  label="Note"
                  value={orderMaster.note}
                  onChange={e => {
                    setOrderMaster({ ...orderMaster, note: e.target.value });
                  }}
                />
              </Grid>
              <Grid container justify="flex-end" item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Button
                  size="small"
                  variant="contained"
                  color="primary"
                  className={classes.btnAdd}
                  onClick={handleAddFields}>
                  Add
                </Button>
              </Grid>
            </Grid>
            <Grid container item xs={12} sm={12} md={12} lg={12}>
              {orderDetails.length > 0 ? (
                <TableContainer component={Paper} className={classes.tableContainer}>
                  <Table size="small" aria-label="a dense table" className={classes.table}>
                    <TableHead>
                      <TableRow>
                        <TableCell>SL</TableCell>
                        <TableCell>Product Info</TableCell>
                        <TableCell align="left">Packaging Type</TableCell>
                        <TableCell align="left">Number of Drum</TableCell>
                        <TableCell align="left">Quantity</TableCell>
                        <TableCell align="right">Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {orderDetails.map((item, index) => (
                        <TableRow key={item.fieldId}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell component="th" scope="row">
                            {item.productName} ({item.productGradeName})
                          </TableCell>
                          <TableCell align="left">{item.purchaseTypeName}</TableCell>
                          <TableCell align="left">
                            {editable ? (
                              <TextField
                                disabled={item.conversionRate === 0}
                                type="number"
                                name="numberOfDrumRequest"
                                value={item.numberOfDrumRequest}
                                onChange={e => {
                                  handleInputChange(item.fieldId, e);
                                  handleConvertion(item.fieldId, e);
                                }}
                                onFocus={e => {
                                  e.target.select();
                                }}
                              />
                            ) : (
                              item.numberOfDrumRequest
                            )}
                          </TableCell>
                          <TableCell align="left">
                            {editable ? (
                              <TextField
                                disabled={item.conversionRate > 0}
                                type="number"
                                name="quantityRequest"
                                value={item.quantityRequest}
                                onChange={e => {
                                  handleInputChange(item.fieldId, e);
                                }}
                                onFocus={e => {
                                  e.target.select();
                                }}
                              />
                            ) : (
                              `${item.quantityRequest} ${item.unitName}`
                            )}
                          </TableCell>
                          <TableCell align="center">
                            <IconButton
                              style={{ color: '#DC004E' }}
                              onClick={() => {
                                setConfirmDialog({
                                  isOpen: true,
                                  title: 'Are you sure to delete this record?',
                                  subTitle: "You cann't undo this operation",
                                  onConfirm: () => {
                                    handleRemoveFields(item);
                                  }
                                });
                              }}>
                              <ClearOutlined />
                            </IconButton>
                            <IconButton
                              style={{ color: '#0DC143' }}
                              onClick={() => {
                                handleEnableEdit();
                              }}>
                              {editable ? <DoneOutline /> : <EditOutlined />}
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : null}
            </Grid>

            <Grid className={classes.btnSubmitDiv} container item xs={12} sm={12} md={12} lg={12} justify="flex-start">
              <Box display="flex">
                <Box ml={2}>
                  <Button onClick={handleSubmit} size="small" variant="outlined" color="primary">
                    Submit
                  </Button>
                </Box>
                <Box ml={2}>
                  <NavLink to="/orders/list">
                    <Button size="small" color="primary" variant="outlined">
                      Cancel
                    </Button>
                  </NavLink>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </form>
      <Dialog
        open={open}
        onClose={() => {}}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <DialogTitle style={{ color: 'black', fontWeight: 'bold' }} id="alert-dialog-title">
          Product already added
        </DialogTitle>
        <DialogContent>
          <DialogContentText style={{ color: '#404040' }} id="alert-dialog-description">
            This product is already added in the list. Are you sure to add this again? If agree, amount will be merged.
          </DialogContentText>
          <DialogContentText style={{ color: 'black', fontWeight: 'bold' }} id="alert-dialog-description">
            If agree, amount will be merged.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" style={{ color: 'red' }} onClick={mergedDisagree} color="primary">
            Disagree
          </Button>
          <Button
            variant="outlined"
            style={{ color: 'green' }}
            onClick={() => {
              mergeAmount();
            }}
            color="primary"
            autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
      <pre id="jsonData"></pre>
      <ConfirmDialog confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog} />
    </PageContainer>
  );
}
