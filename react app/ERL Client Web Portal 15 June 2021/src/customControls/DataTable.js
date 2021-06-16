import { Box } from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import React from 'react';
import customStyles from 'theme/customStyles';
import { AddIcon, DeleteIcon, EditIcon, FilterIcon } from './ActionButtons/ActionButtons';

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

function EnhancedTableHead(props) {
  const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, headCells } = props;
  const createSortHandler = property => event => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            color="primary"
            inputProps={{ 'aria-label': 'select all desserts' }}
          />
        </TableCell>
        {headCells.map(headCell => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            // padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}>
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}>
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>{order === 'desc' ? 'sorted descending' : 'sorted ascending'}</span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']),
  orderBy: PropTypes.string,
  rowCount: PropTypes.number
};

const EnhancedTableToolbar = props => {
  const classes = customStyles();
  const { numSelected, tableTitle, onDelete, onFilter, isCollapse, filter, onAdd, ...rest } = props;

  return (
    <>
      <Toolbar
        className={clsx(classes.rootToolbar, {
          [classes.highlightToolbar]: numSelected > 0
        })}>
        {numSelected > 0 ? (
          <Typography className={classes.titleToolbar} color="inherit" variant="subtitle1" component="div">
            {numSelected} selected
          </Typography>
        ) : (
          <Typography className={classes.titleToolbar} variant="h6" id="tableTitle" component="div">
            {tableTitle}
          </Typography>
        )}

        {numSelected > 0 ? (
          <DeleteIcon title="Delete" placement="bottom" onClick={onDelete} />
        ) : (
          <>
            {rest?.AddNewArray?.length && <AddIcon title="Add New" placement="bottom" onClick={onAdd} />}
            {rest?.filterArray?.length && <FilterIcon title="Filter" placement="bottom" onClick={onFilter} />}
          </>
        )}
      </Toolbar>
      {filter && (
        <>
          <Box className={classes.filterMainBox}>
            {rest.filterArray.map((item, index) => {
              return (
                <Box margin={2} key={index + 1}>
                  {item.field}
                </Box>
              );
            })}
          </Box>
        </>
      )}
      {isCollapse && (
        <>
          <Box className={classes.AddMainBox}>
            {rest.AddNewArray.map((item, index) => {
              return (
                <Box margin={2} key={index + 1}>
                  {item.field}
                </Box>
              );
            })}
          </Box>
        </>
      )}
    </>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired
};

export default function DataTable(props) {
  const {
    order,
    orderBy,
    selected,
    page,
    rowsPerPage,
    handleRequestSort,
    handleSelectAllClick,
    handleRowClick,
    handleChangePage,
    handleChangeRowsPerPage,
    rows = [],
    totalRows,
    headCells,
    tableTitle,
    cellNames,
    onDelete,
    onFilter,
    filter,
    isCollapse,
    onAdd,
    handleEdit,
    ...rest
  } = props;

  const classes = customStyles();

  const isSelected = name => selected.indexOf(name) !== -1;

  // const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar
          tableTitle={tableTitle}
          onFilter={onFilter}
          onAdd={onAdd}
          onDelete={onDelete}
          numSelected={selected.length}
          filterArray={rest.filterArray}
          AddNewArray={rest.AddNewArray}
          filter={filter}
          isCollapse={isCollapse}
        />
        <TableContainer>
          <Table className={classes.table} aria-labelledby="tableTitle" size="small" aria-label="enhanced table">
            <EnhancedTableHead
              headCells={headCells}
              classes={classes}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows?.length} //rows.length
            />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                // .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.id);
                  const labelId = `enhanced-table-checkbox-${index}`;
                  return (
                    <TableRow
                      hover
                      // onClick={event => handleRowClick(event, row.id)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.id}
                      selected={isItemSelected}>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isItemSelected}
                          onChange={event => handleRowClick(event, row.id)}
                          color="primary"
                          inputProps={{ 'aria-labelledby': labelId }}
                        />
                      </TableCell>

                      {cellNames.map((cellName, index) => (
                        <TableCell key={index + 1} align="left">
                          {row[cellName]}
                        </TableCell>
                      ))}
                      <TableCell align="center" padding="checkbox">
                        {handleEdit && (
                          <EditIcon
                            title="Edit"
                            placement="bottom"
                            onClick={() => {
                              handleEdit(row);
                            }}
                          />
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              {/* {emptyRows > 0 && (
                <TableRow style={{ height: 33 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )} */}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalRows} //row.length
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}
