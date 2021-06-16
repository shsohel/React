import CmtVertical from '@coremat/CmtNavigation/Vertical';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { ArrowForward, PostAdd, ShoppingCart, Storefront, SupervisedUserCircle } from '@material-ui/icons';
import { roleTypes } from 'constants/RoleTypes';
import React from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useSelector } from 'react-redux';

const useStyles = makeStyles(theme => ({
  perfectScrollbarSidebar: {
    height: '100%',
    transition: 'all 0.3s ease',
    '.Cmt-sidebar-fixed &, .Cmt-Drawer-container &': {
      height: 'calc(100% - 167px)'
    },
    '.Cmt-modernLayout &': {
      height: 'calc(100% - 72px)'
    },
    '.Cmt-miniLayout &': {
      height: 'calc(100% - 91px)'
    },
    '.Cmt-miniLayout .Cmt-sidebar-content:hover &': {
      height: 'calc(100% - 167px)'
    }
  }
}));

const SideBar = () => {
  const classes = useStyles();
  const { authUser } = useSelector(({ auth }) => auth);
  const navigationMenus = [
    // {
    //   name: 'Main',
    //   icon: <CenterFocusWeakOutlined />,
    //   type: 'section',
    //   children: [
    //     {
    //       name: 'Test',
    //       icon: <PostAdd />,
    //       type: 'item',
    //       link: '/test'
    //     }
    //   ]
    // },

    authUser?.role !== roleTypes.User
      ? {
          name: 'Accounts',
          icon: <SupervisedUserCircle />,
          type: 'section',
          children: [
            {
              name: 'Roles',
              icon: <PostAdd />,
              type: 'item',
              link: '/accounts/role'
            },
            {
              name: 'Users',
              icon: <PostAdd />,
              type: 'item',
              link: '/accounts/user'
            }
          ]
        }
      : {},
    {
      name: 'Products',
      icon: <Storefront />,
      type: 'section',
      children: [
        {
          name: 'Product List',
          type: 'item',
          icon: <ArrowForward />,
          link: '/products/list'
        }
      ]
    },
    {
      name: 'Orders',
      icon: <ShoppingCart />,
      type: 'section',
      children: [
        {
          name: 'Order List',
          type: 'item',
          icon: <ArrowForward />,
          link: '/orders/list'
        }
      ]
    }
  ];
  return (
    <PerfectScrollbar className={classes.perfectScrollbarSidebar}>
      <CmtVertical menuItems={navigationMenus} />
    </PerfectScrollbar>
  );
};

export default SideBar;
