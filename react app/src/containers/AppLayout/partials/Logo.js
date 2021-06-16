import CmtAvatar from '@coremat/CmtAvatar';
import { Box } from '@material-ui/core';
import Hidden from '@material-ui/core/Hidden';
import React from 'react';
import { NavLink } from 'react-router-dom';

const Logo = ({ color, ...props }) => {
  const logoUrl = color === 'white' ? '/images/erlLogo.jpg' : '/images/erlLogo.jpg';
  const logoSymbolUrl = color === 'white' ? '/images/erlLogo.jpg' : '/images/erlLogo.jpg';

  return (
    <Box {...props}>
      <Hidden xsDown>
        <Box display="flex">
          <Box mr={3}>
            <NavLink to="/">
              <CmtAvatar src={logoUrl} alt="logo" />
            </NavLink>
          </Box>
          {/* <Box>
            <Typography variant="h3" style={{ color: 'White', marginTop: '15px', fontWeight: 'bold' }}>
              Eastern Refinery Limited
            </Typography>
          </Box> */}
        </Box>
      </Hidden>
      <Hidden smUp>
        <Box display="flex">
          <Box mr={3}>
            <NavLink to="/">
              <CmtAvatar src={logoSymbolUrl} alt="logo" />
            </NavLink>
          </Box>
          {/* <Box>
            <Typography variant="h3" style={{ color: 'White', marginTop: '15px', fontWeight: 'bold' }}>
              Eastern Refinery Limited
            </Typography>
          </Box> */}
        </Box>
      </Hidden>
    </Box>
  );
};

export default Logo;
