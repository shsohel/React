import { Delete, Edit, RemoveRedEyeOutlined } from '@material-ui/icons';
import React from 'react';
export const actionIcons = [
  {
    icon: <Delete />,
    label: 'delete'
  },
  {
    icon: <Edit />,
    label: 'edit'
  },
  {
    icon: <RemoveRedEyeOutlined />,
    label: 'view'
  }
];
const btnActionsType = {
  action: m => {}
};

export default btnActionsType;
