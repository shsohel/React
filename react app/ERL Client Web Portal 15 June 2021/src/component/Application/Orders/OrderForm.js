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
import { RemoveCircleOutline } from '@material-ui/icons';
import PageContainer from 'containers/PageComponents/layouts/PageContainer';
import qs from 'querystring';
import React, { useEffect, useState } from 'react';
import { NotificationContainer } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { useSelector } from 'react-redux';
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
    borderRadius: '5px'
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
  { label: 'New', link: 'orders/new', isActive: true }
];

const initialFieldValues = {
  id: 0,
  requestDateAndTime: '',
  productId: '',
  productName: '',
  unitId: '',
  unitName: '',
  productGradeId: '',
  productGradeName: '',
  purchaseTypeId: '',
  numberOfDrumRequest: '',
  quantityRequest: '',
  numberOfDrumFinal: 0,
  quantityFinal: 0
};

const masterInfo = {
  note: ''
};

export default function OrderForm(props) {
  const classes = useStyles();
  const { authUser } = useSelector(({ auth }) => auth);
  const [products, setProducts] = useState([]); /// For Product DropDown
  const [grades, setGrades] = useState([]); /// For grade DropDown
  const [purchaseTypes, setPurchaseTypes] = useState([]); /// For purchasetype DropDown
  const [perUnitPrice, setPerUnitPrice] = useState(0);
  const [purchaseType, setPurchaseType] = useState({});
  const [conversionValue, setConversionValue] = useState(0);
  const [masterInfoState, setMasterInfoState] = useState(masterInfo);
  const [order, setOrder] = useState(initialFieldValues);
  const [orderDetails, setOrderDetails] = useState([]);
  const [isUnitConverstionGet, setIsUnitConverstionGet] = useState(false);
  const [isUnitPriceGet, setIsUnitPriceGet] = useState(false);
  const [open, setOpen] = useState(false);
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
            conversionRate: conversionValue,
            perUnitPrice: perUnitPrice
          }
        ]);
        setOrder(initialFieldValues);
        setPerUnitPrice(0);
        setConversionValue(0);
        document.getElementById('ddlProduct').focus();
        setIsUnitPriceGet(false);
        setIsUnitConverstionGet(false);
      }
    } else {
      alerts('warning', 'Please define order information first!!!');
    }
  };

  const handleRemoveFields = fieldId => {
    const values = [...orderDetails];
    values.splice(
      values.findIndex(value => value.fieldId === fieldId),
      1
    );
    setOrderDetails(values);
  };

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
    getAllProdcut();
    getAllPurchaseType();
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
      setIsUnitConverstionGet(true);
    }
    getPerUnitPrice(selectedPurchaseType);
  };

  const handleNumberOfDrumRequest = e => {
    const { value } = e.target;
    if (value.includes('.')) {
      alerts('error', 'Decimal not allowed!!!');
      return;
    }
    setOrder({
      ...order,
      numberOfDrumRequest: Number(value),
      quantityRequest: Number((value * conversionValue).toFixed(3))
    });
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
        .then(({ data }) => {
          if (data.succeeded) {
            const body = data.data;
            setConversionValue(body);
            setIsUnitConverstionGet(true);
          } else {
            setIsUnitConverstionGet(false);
          }
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
          setIsUnitPriceGet(true);
        } else {
          setOrder({ ...order, productGradeId: '', productName: '', purchaseTypeId: '' });
          alerts('warning', 'Selected Grades has not price configuration!!!');
          setIsUnitPriceGet(false);
        }
      })
      .catch(({ response }) => {
        // alerts('error', `${response.data.Message}`);
        alerts('error', 'Price not found for this product');
        setIsUnitPriceGet(false);
      });
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (orderDetails.length > 0) {
      const body = {
        id: order.id,
        customerId: parseInt(authUser.companyId),
        customerName: authUser.companyName,
        note: masterInfoState.note,
        requestDateAndTime: new Date(),
        orderDetails
      };
      // document.getElementById('jsonData').textContent = JSON.stringify(body, null, 2);
      axios
        .post(urls.order.post, body)
        .then(({ data }) => {
          if (data.succeeded) {
            alerts('success', 'Order Added Successfully!!!');

            props.history.replace('/orders/list');
          } else {
            alerts('warning', `${data.message}`);
          }
        })
        .catch(({ response }) => {
          alerts('error', `${response.data.Message}`);
        });
    } else {
      alerts('error', 'Please add at least a single product');
    }
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
    <PageContainer heading="New Order Entry" breadcrumbs={breadcrumbs}>
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
                  select
                  id="ddlGrade"
                  disabled={!order.productId}
                  className={classes.textField}
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
                  select
                  id="ddlPurchaseType"
                  disabled={!order.productGradeId}
                  className={classes.textField}
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
                      handleNumberOfDrumRequest(e);
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
                  multiline
                  size="small"
                  margin="normal"
                  variant="outlined"
                  name="note"
                  label="Note"
                  value={masterInfoState.note}
                  onChange={e => {
                    setMasterInfoState({ ...masterInfoState, note: e.target.value });
                  }}
                />
              </Grid>
              <Grid container justify="flex-end" item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Button
                  disabled={!isUnitPriceGet && !isUnitConverstionGet}
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
                          <TableCell align="left">{item.numberOfDrumRequest}</TableCell>
                          <TableCell align="left">
                            {item.quantityRequest} {item.unitName}
                          </TableCell>
                          <TableCell align="right">
                            <IconButton
                              style={{ color: '#DC004E' }}
                              onClick={() => {
                                handleRemoveFields(item.fieldId);
                              }}>
                              <RemoveCircleOutline />
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
                  <Button
                    disabled={!orderDetails.length}
                    onClick={handleSubmit}
                    size="small"
                    variant="outlined"
                    color="primary">
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
    </PageContainer>
  );
}
