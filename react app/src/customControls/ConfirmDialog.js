import { Box, DialogContentText, Slide } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import React from 'react';
import customStyles from 'theme/customStyles';
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
export default function ConfirmDialog({ confirmDialog, setConfirmDialog, ...props }) {
  const classes = customStyles();

  return (
    <Box>
      {/* <Dialog open={confirmDialog?.isOpen} classes={{ paper: classes.dialog }}>
        <DialogTitle className={classes.dialogTitle}>
          <IconButton disableRipple className={classes.titleIcon}>
            <NotListedLocation />
          </IconButton>
        </DialogTitle>
        <DialogContent className={classes.dialogContent}>
          <Typography variant="h6">{confirmDialog.title}</Typography>
          <Typography variant="subtitle2">{confirmDialog.subTitle}</Typography>
        </DialogContent>
        <DialogActions className={classes.dialogAction}>
          <Button
            onClick={() => {
              setConfirmDialog({ ...confirmDialog, isOpen: false });
            }}
            color="primary"
            autoFocus>
            Cancel
          </Button>
          <Button onClick={confirmDialog.onConfirm} color="primary" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog> */}
      <Dialog
        open={confirmDialog?.isOpen}
        TransitionComponent={Transition}
        keepMounted
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description">
        <DialogTitle id="alert-dialog-slide-title"> {confirmDialog.title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">{confirmDialog.subTitle}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setConfirmDialog({ ...confirmDialog, isOpen: false });
            }}
            color="primary"
            autoFocus>
            Cancel
          </Button>
          <Button onClick={confirmDialog.onConfirm} color="primary" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

//
