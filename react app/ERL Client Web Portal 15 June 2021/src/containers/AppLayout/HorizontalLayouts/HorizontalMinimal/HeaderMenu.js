import CmtHorizontal from '@coremat/CmtNavigation/Horizontal';
import { ArrowForward, PostAdd, ShoppingCart, Storefront, SupervisedUserCircle } from '@material-ui/icons';
import { roleTypes } from 'constants/RoleTypes';
import React from 'react';
import { useSelector } from 'react-redux';

const HeaderMenu = () => {
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
            // {
            //   name: 'Approval Process',
            //   icon: <PostAdd />,
            //   type: 'item',
            //   link: '/accounts/approval-process'
            // }
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
        // {
        //   name: 'Order Confirmation',
        //   type: 'item',
        //   icon: <ArrowForward />,
        //   link: '/orders/order-confirmation'
        // }
      ]
    }
  ];

  return <CmtHorizontal menuItems={navigationMenus} />;
};

export default HeaderMenu;
