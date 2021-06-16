import { Box, TextField } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import { makeStyles } from '@material-ui/core/styles';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import React from 'react';

const useStyles = makeStyles({
  list: {
    width: 800
  },
  fullList: {
    width: 'auto'
  }
});

export default function Test() {
  const classes = useStyles();
  const [state, setState] = React.useState({
    right: false
  });

  const toggleDrawer = (anchor, open) => event => {
    setState({ ...state, [anchor]: open });
  };

  const list = anchor => (
    <Box
      style={{ padding: '25px', border: 'solid #DEDEDE 2px', width: '400px', margin: '5px' }}
      role="presentation"
      // onClick={toggleDrawer(anchor, false)}
      // onKeyDown={toggleDrawer(anchor, false)}
    >
      <Divider />

      <Box>
        <TextField />
        <TextField />
      </Box>
      <Divider />
      <Button onClick={toggleDrawer(anchor, false)}>Close</Button>
    </Box>
  );

  return (
    <Box>
      {['right'].map(anchor => (
        <React.Fragment key={anchor}>
          <Button onClick={toggleDrawer(anchor, true)}>{anchor}</Button>
          <SwipeableDrawer
            anchor={anchor}
            open={state[anchor]}
            onClose={() => {
              toggleDrawer(anchor, false);
            }}
            onOpen={() => {
              toggleDrawer(anchor, true);
            }}>
            {list(anchor)}
          </SwipeableDrawer>
        </React.Fragment>
      ))}
    </Box>
  );
}
