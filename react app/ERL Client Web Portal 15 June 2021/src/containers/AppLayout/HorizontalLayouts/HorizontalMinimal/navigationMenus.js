import { ArrowForward, PostAdd, ShoppingCart, Storefront, SupervisedUserCircle } from '@material-ui/icons';
import React from 'react';

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

  {
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
      },
      {
        name: 'Approval Process',
        icon: <PostAdd />,
        type: 'item',
        link: '/accounts/approval-process'
      }
    ]
  },
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
      },
      {
        name: 'Order Confirmation',
        type: 'item',
        icon: <ArrowForward />,
        link: '/orders/order-confirmation'
      }
    ]
  }
];

export default navigationMenus;
