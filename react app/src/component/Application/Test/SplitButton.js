import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grid from '@material-ui/core/Grid';
import Grow from '@material-ui/core/Grow';
import MenuList from '@material-ui/core/MenuList';
import Popper from '@material-ui/core/Popper';
import { MoreVert } from '@material-ui/icons';
import React from 'react';

export default function SplitButton({ children }) {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);

  const handleToggle = () => {
    setOpen(prevOpen => !prevOpen);
  };

  const handleClose = event => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  return (
    <Grid container direction="column" alignItems="center">
      <Grid item xs={12}>
        <MoreVert color="primary" ref={anchorRef} onClick={handleToggle} />
        <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom'
              }}>
              <div style={{ backgroundColor: 'white' }}>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList id="split-button-menu">{children}</MenuList>
                </ClickAwayListener>
              </div>
            </Grow>
          )}
        </Popper>
      </Grid>
    </Grid>
  );
}
