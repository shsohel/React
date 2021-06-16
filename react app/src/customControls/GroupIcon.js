import { Box, Menu, MenuItem } from '@material-ui/core';
import PropTypes from 'prop-types';
import React, { useState } from 'react';

const GroupIcon = ({ triggerComponent, items, onItemClick }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuItems, setMenuItems] = useState(items);
  const open = Boolean(anchorEl);

  const openMenu = event => {
    setAnchorEl(event.currentTarget);
  };

  const closeMenu = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (item, selectedIndex) => {
    let updatedItem = { ...item };

    if (item.onClick && typeof item.onClick === 'function') {
      updatedItem = item.onClick(item);
    } else if (onItemClick && typeof onItemClick === 'function') {
      updatedItem = onItemClick(item);
    }

    setMenuItems(
      menuItems.map((item, index) => {
        if (updatedItem && selectedIndex === index) {
          item = updatedItem;
        }
        return item;
      })
    );

    closeMenu();
  };

  return (
    <React.Fragment>
      <Box className="pointer">
        <triggerComponent.type {...triggerComponent.props} onClick={openMenu} />
      </Box>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={closeMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}>
        {menuItems.map((item, index) => {
          return (
            <MenuItem key={index} disabled={item.disabled} onClick={() => handleMenuItemClick({ ...item }, index)}>
              {item?.icon} {item?.label}
            </MenuItem>
          );
        })}
      </Menu>
    </React.Fragment>
  );
};

GroupIcon.propTypes = {
  items: PropTypes.array.isRequired,
  triggerComponent: PropTypes.element.isRequired,
  onItemClick: PropTypes.func
};

export default GroupIcon;
