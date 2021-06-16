import {
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
  Typography
} from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import PageContainer from 'containers/PageComponents/layouts/PageContainer';
import { ConfirmDialog, GroupButtons, PopupSection } from 'customControls';
import { ViewButton } from 'customControls/ActionButtons/ActionButtons';
import React, { useEffect, useState } from 'react';
import 'react-notifications/lib/notifications.css';
import { useSelector } from 'react-redux';
import axios, { urls } from 'services/auth/jwt/config';
import ProductPreview from './ProductPreview';
const useStyles = makeStyles(theme => ({
  formControl: {
    marginRight: theme.spacing(2),
    minWidth: 120,
    fontWeight: 50
  },
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
  },
  tContainer: {
    marginBottom: theme.spacing(3)
  }
}));

const breadcrumbs = [
  { label: 'Home', link: '/' },
  { label: 'Products', link: '/products/list', isActive: true }
];

const headCells = [
  { id: 'NameEN', label: 'Name' },
  { id: 'unitId', label: 'Unit', disableSorting: true },
  { id: 'status', label: 'Status', disableSorting: true },
  { id: 'actions', label: 'Actions', disableSorting: true }
];

export default function ProductList(props) {
  const classes = useStyles();
  const [records, setRecords] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [recordForDetails, setrecordForDetails] = useState(null);
  const [openPopup, setOpenPopup] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '' });

  const pages = [10, 15, 20];
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(pages[page]);
  const [dataLength, setDataLength] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [sortedBy, setSortedBy] = useState('asc');
  const [sortedColumn, setSortedColumn] = useState('Id');

  const { userPermission } = useSelector(({ auth }) => auth);

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

  const getAllProducts = async () => {
    try {
      await axios
        .get(
          `${urls.products.get_all}?PageNumber=${pageNumber}&PageSize=${rowsPerPage}&SortedColumn=${sortedColumn}&SortedBy=${sortedBy}`
        )
        .then(res => {
          setRecords(res.data.data);
          setDataLength(res.data.totalCount);
          setIsLoaded(true);
        });
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    getAllProducts();
  }, [rowsPerPage, pageNumber, sortedBy, sortedColumn]);

  const closePopup = () => {
    setOpenPopup(false);
  };

  const openGradePopup = record => {
    setrecordForDetails(null);
    setOpenPopup(true);
  };

  const PreviewOrder = productId => {
    if (productId) {
      axios.get(`${urls.products.get_by_id}/${productId}`).then(({ data }) => {
        if (data.succeeded) {
          const body = data.data;

          // setrecordForDetails(body);
          //setOpenPopup(true);
        }
      });
    }
  };

  let tableContent = null;
  if (isLoaded) {
    tableContent = (
      <>
        <TableContainer className={classes.tContainer} component={Paper}>
          <Table className={classes.table} size="small">
            <TableHead>
              <TableRow>
                {headCells.map(headCell => (
                  <TableCell align="justify" key={headCell.id}>
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
              {records.map(record => (
                <TableRow key={record.id}>
                  <TableCell align="justify">{record.nameEN}</TableCell>
                  <TableCell align="justify">{record.unitName}</TableCell>

                  <TableCell align="justify">{record.isActive ? 'Active' : 'Inactive'}</TableCell>
                  <TableCell align="justify">
                    <GroupButtons>
                      <ViewButton
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
    <PageContainer heading="Products" breadcrumbs={breadcrumbs}>
      <div className={classes.mainDiv}>
        <br /> <br />
        <Grid container item xs={12} sm={12} md={12} lg={12} xl={12}>
          {tableContent}
        </Grid>
        {recordForDetails && (
          <PopupSection title="Product Details" openPopup={openPopup} setOpenPopup={setOpenPopup}>
            <ProductPreview closePopup={closePopup} recordForDetails={recordForDetails} />
          </PopupSection>
        )}
        <ConfirmDialog confirmDialog={confirmDialog} setConfirmDialog={setConfirmDialog} />
      </div>
    </PageContainer>
  );
}
