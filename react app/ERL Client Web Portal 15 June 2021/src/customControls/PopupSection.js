import { Dialog, DialogContent, DialogTitle, makeStyles, Paper, Typography } from '@material-ui/core';
import React from 'react';
import Draggable from 'react-draggable';
import { CancelFilterIcon } from './ActionButtons/ActionButtons';
const useStyles = makeStyles(theme => ({
  dialogWraper: {
    padding: theme.spacing(2),
    position: 'absolute',
    top: theme.spacing(5)
  },
  dialogTitle: {
    padding: '0px'
  }
}));
function PaperComponent(props) {
  return (
    <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper {...props} />
    </Draggable>
  );
}

export default function PopupSection(props) {
  const classes = useStyles();
  const { title, children, openPopup, setOpenPopup } = props;
  return (
    <Dialog
      aria-labelledby="draggable-dialog-title"
      PaperComponent={PaperComponent}
      open={openPopup}
      maxWidth="md"
      classes={{ paper: classes.dialogWraper }}>
      <DialogTitle className={classes.dialogTitle} style={{ cursor: 'move' }} scroll="paper" id="draggable-dialog-title">
        <div style={{ display: 'flex' }}>
          <Typography variant="h6" component="div" style={{ flexGrow: 1 }}>
            {title}
          </Typography>
          <CancelFilterIcon title="Close" placement="left" onClick={() => setOpenPopup(false)} />
        </div>
      </DialogTitle>
      <DialogContent dividers>{children}</DialogContent>
    </Dialog>
  );
}
