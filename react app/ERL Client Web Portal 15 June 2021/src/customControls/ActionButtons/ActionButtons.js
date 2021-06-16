import { Button, IconButton, Tooltip } from '@material-ui/core';
import {
  Add,
  CancelOutlined,
  CancelPresentation,
  Check,
  CheckCircleOutline,
  Close,
  ConfirmationNumberOutlined,
  DeleteOutline,
  EditOutlined,
  FilterListOutlined,
  Lock,
  MoreVert,
  PersonAddDisabled,
  PrintOutlined,
  RemoveCircle,
  RemoveRedEyeOutlined,
  SearchOutlined,
  SettingsOutlined
} from '@material-ui/icons';
import clsx from 'clsx';
import React from 'react';
import customStyles from 'theme/customStyles';
import './ActionButtons.css';

export const MoreIcon = props => {
  const classes = customStyles();
  const { title, placement, color, onClick, disabled } = props;
  return (
    <>
      <Tooltip arrow title={title} placement={placement}>
        <span>
          <IconButton size="small" className={classes.moreButton} color={color} disabled={disabled} onClick={onClick}>
            <MoreVert />
          </IconButton>
        </span>
      </Tooltip>
    </>
  );
};

export const InActiveIcon = props => {
  const classes = customStyles();
  const { title, placement, color, onClick, disabled, ...others } = props;
  return (
    <>
      <Tooltip arrow title={title} placement={placement}>
        <span>
          <IconButton size="small" disabled={disabled} className={classes.deleteButton} onClick={onClick}>
            <PersonAddDisabled />
          </IconButton>
        </span>
      </Tooltip>
    </>
  );
};
export const InActiveButton = props => {
  const classes = customStyles();
  const { onClick } = props;
  return (
    <>
      <Button
        className={classes.deleteButton}
        fullWidth
        variant="outlined"
        color="primary"
        size="small"
        onClick={onClick}
        startIcon={<PersonAddDisabled />}>
        In Active User
      </Button>
    </>
  );
};

export const NewButton = props => {
  const classes = customStyles();
  const { onClick } = props;
  return (
    <>
      <Button
        className={clsx(classes.iconButton, 'new')}
        variant="outlined"
        color="primary"
        size="small"
        onClick={onClick}
        endIcon={<Add />}>
        New
      </Button>
    </>
  );
};
export const AddFiles = props => {
  const classes = customStyles();
  const { onClick } = props;
  return (
    <>
      <Button
        className={clsx(classes.iconButton, 'new')}
        variant="outlined"
        color="primary"
        size="small"
        onClick={onClick}
        endIcon={<Add />}>
        Add Files
      </Button>
    </>
  );
};

export const CancelButton = props => {
  const classes = customStyles();
  const { onClick } = props;
  return (
    <>
      <Button
        className={clsx(classes.iconButton, 'cancel')}
        variant="outlined"
        color="primary"
        size="small"
        onClick={onClick}
        endIcon={<Close />}>
        Cancel
      </Button>
    </>
  );
};
export const ResetButton = props => {
  const classes = customStyles();
  const { onClick } = props;
  return (
    <>
      <Button
        className={clsx(classes.iconButton, 'reset')}
        variant="outlined"
        color="primary"
        size="small"
        onClick={onClick}
        endIcon={<Close />}>
        Reset
      </Button>
    </>
  );
};
export const SubmitButton = props => {
  const classes = customStyles();
  const { onClick } = props;
  return (
    <>
      <Button
        className={clsx(classes.iconButton, 'submit')}
        variant="outlined"
        size="small"
        onClick={onClick}
        endIcon={<Check />}>
        Submit
      </Button>
    </>
  );
};

export const PasswordIcon = props => {
  const classes = customStyles();
  const { title, placement, color, onClick, disabled } = props;
  return (
    <>
      <Tooltip arrow title={title} placement={placement}>
        <span>
          <IconButton
            size="small"
            disabled={disabled}
            onClick={onClick}
            className={clsx(classes.passwordButton, 'password')}
            color={color}>
            <Lock />
          </IconButton>
        </span>
      </Tooltip>
    </>
  );
};
export const PasswordButton = ({ title, onClick, disabled }) => {
  const classes = customStyles();
  // const { title, placement, color, onClick, disabled,   } = props
  return (
    <>
      <Button
        fullWidth
        className={classes.passwordButton}
        variant="outlined"
        size="small"
        onClick={onClick}
        startIcon={<Lock />}>
        Reset Password
      </Button>
    </>
  );
};

export const AddIcon = props => {
  const classes = customStyles();
  const { title, placement, onClick, disabled } = props;
  return (
    <>
      <Tooltip arrow title={title} placement={placement}>
        <span>
          <IconButton className={classes.addButton} size="small" disabled={disabled} onClick={onClick}>
            <Add className={classes.addButton} />
          </IconButton>
        </span>
      </Tooltip>
    </>
  );
};

export const EditButton = ({ title, onClick, disabled }) => {
  const classes = customStyles();
  // const { title, placement, color, onClick, disabled,   } = props
  return (
    <>
      <Button
        fullWidth
        className={classes.editButton}
        variant="outlined"
        size="small"
        onClick={onClick}
        startIcon={<EditOutlined />}>
        Edit
      </Button>
    </>
  );
};

export const EditIcon = ({ title, placement, onClick, disabled }) => {
  const classes = customStyles();
  // const { title, placement, color, onClick, disabled,   } = props
  return (
    <>
      <Tooltip arrow title={title} placement={placement}>
        <span>
          <IconButton size="small" className={classes.editButton} disabled={disabled} onClick={onClick}>
            <EditOutlined className={classes.editButton} />
          </IconButton>
        </span>
      </Tooltip>
    </>
  );
};

export const DeleteIcon = props => {
  const classes = customStyles();
  const { title, placement, onClick, disabled } = props;
  return (
    <>
      <Tooltip arrow title={title} placement={placement}>
        <span>
          <IconButton size="small" disabled={disabled} className={classes.deleteButton} onClick={onClick}>
            <DeleteOutline className={classes.deleteButton} />
          </IconButton>
        </span>
      </Tooltip>
    </>
  );
};
export const DeleteButton = ({ title, onClick, disabled }) => {
  const classes = customStyles();
  // const { title, placement, color, onClick, disabled,   } = props
  return (
    <>
      <Button
        fullWidth
        className={classes.deleteButton}
        variant="outlined"
        size="small"
        onClick={onClick}
        startIcon={<DeleteOutline />}>
        Delete
      </Button>
    </>
  );
};
export const CrosIcon = props => {
  const classes = customStyles();
  const { title, placement, onClick, disabled } = props;
  return (
    <>
      <Tooltip arrow title={title} placement={placement}>
        <span>
          <IconButton size="small" disabled={disabled} className={classes.crosButton} onClick={onClick}>
            <Close className={classes.crosButton} />
          </IconButton>
        </span>
      </Tooltip>
    </>
  );
};
export const RemoveIcon = props => {
  const classes = customStyles();
  const { title, placement, onClick, disabled } = props;
  return (
    <>
      <Tooltip arrow title={title} placement={placement}>
        <span>
          <IconButton size="small" className={classes.removeButton} disabled={disabled} onClick={onClick}>
            <RemoveCircle className={classes.removeButton} />
          </IconButton>
        </span>
      </Tooltip>
    </>
  );
};

export const ViewIcon = props => {
  const classes = customStyles();
  const { title, placement, onClick, disabled } = props;
  return (
    <>
      <Tooltip arrow title={title} placement={placement}>
        <span>
          <IconButton size="small" disabled={disabled} onClick={onClick} className={classes.viewButton}>
            <RemoveRedEyeOutlined className={classes.viewButton} />
          </IconButton>
        </span>
      </Tooltip>
    </>
  );
};
export const ViewButton = ({ title, onClick, disabled }) => {
  const classes = customStyles();
  // const { title, placement, color, onClick, disabled,   } = props
  return (
    <>
      <Button
        fullWidth
        className={classes.viewButton}
        variant="outlined"
        size="small"
        onClick={onClick}
        startIcon={<RemoveRedEyeOutlined />}>
        View
      </Button>
    </>
  );
};
export const SettingsIcon = props => {
  const { title, placement, color, onClick, disabled } = props;
  return (
    <>
      <Tooltip arrow title={title} placement={placement}>
        <span>
          <IconButton size="small" disabled={disabled} onClick={onClick} color={color || 'primary'}>
            <SettingsOutlined />
          </IconButton>
        </span>
      </Tooltip>
    </>
  );
};
export const PrintIcon = props => {
  const classes = customStyles();
  const { title, placement, color, onClick, disabled } = props;
  return (
    <>
      <Tooltip arrow title={title} placement={placement}>
        <span>
          <IconButton size="small" className={classes.printButton} color={color} disabled={disabled} onClick={onClick}>
            <PrintOutlined className={classes.printButton} />
          </IconButton>
        </span>
      </Tooltip>
    </>
  );
};
export const CancelIcon = props => {
  const classes = customStyles();
  const { title, placement, color, onClick, disabled } = props;
  return (
    <>
      <Tooltip arrow title={title} placement={placement}>
        <span>
          <IconButton size="small" className={classes.CancelButton} color={color} disabled={disabled} onClick={onClick}>
            <CancelPresentation />
          </IconButton>
        </span>
      </Tooltip>
    </>
  );
};
export const CheckIcon = props => {
  const classes = customStyles();
  const { title, placement, color, onClick, disabled } = props;
  return (
    <>
      <Tooltip arrow title={title} placement={placement}>
        <span>
          <IconButton size="small" className={classes.CheckButton} color={color} disabled={disabled} onClick={onClick}>
            <CheckCircleOutline />
          </IconButton>
        </span>
      </Tooltip>
    </>
  );
};

export const ConfirmIcon = props => {
  const classes = customStyles();
  const { title, placement, color, onClick, disabled } = props;
  return (
    <>
      <Tooltip arrow title={title} placement={placement}>
        <span>
          <IconButton size="small" className={classes.ConfirmButton} color={color} disabled={disabled} onClick={onClick}>
            <ConfirmationNumberOutlined />
          </IconButton>
        </span>
      </Tooltip>
    </>
  );
};
export const ConfirmButton = ({ title, onClick, disabled }) => {
  const classes = customStyles();
  return (
    <>
      <Button
        fullWidth
        className={classes.ConfirmButton}
        variant="outlined"
        size="small"
        onClick={onClick}
        startIcon={<ConfirmationNumberOutlined />}>
        Confirm
      </Button>
    </>
  );
};

export const FilterIcon = props => {
  const classes = customStyles();
  const { title, placement, color, onClick, disabled } = props;
  return (
    <>
      <Tooltip arrow title={title} placement={placement}>
        <span>
          <IconButton size="small" className={classes.filterButton} color={color} disabled={disabled} onClick={onClick}>
            <FilterListOutlined />
          </IconButton>
        </span>
      </Tooltip>
    </>
  );
};
export const CancelFilterIcon = props => {
  const classes = customStyles();
  const { title, placement, color, onClick, disabled } = props;
  return (
    <>
      <Tooltip arrow title={title} placement={placement}>
        <span>
          <IconButton
            size="small"
            className={classes.cancelFilterButton}
            color={color}
            disabled={disabled}
            onClick={onClick}>
            <CancelOutlined />
          </IconButton>
        </span>
      </Tooltip>
    </>
  );
};
export const SearchIcon = props => {
  const classes = customStyles();
  const { title, placement, color, onClick, disabled } = props;
  return (
    <>
      <Tooltip arrow title={title} placement={placement}>
        <span>
          <IconButton size="small" className={classes.searchBoxButton} color={color} disabled={disabled} onClick={onClick}>
            <SearchOutlined />
          </IconButton>
        </span>
      </Tooltip>
    </>
  );
};

export const actionIcons = [
  {
    icon: <DeleteIcon />,
    label: 'Delete'
  },
  {
    icon: <EditIcon />,
    label: 'Edit'
  },
  {
    icon: <ViewIcon />,
    label: 'View'
  }
];
