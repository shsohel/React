import React from 'react';
import { Breadcrumbs, Chip, emphasize, withStyles } from '@material-ui/core';

const StyledBreadcrumb = withStyles(theme => ({
  root: {
    backgroundColor: theme.palette.grey[100],
    height: theme.spacing(5),
    color: theme.palette.grey[800],
    fontWeight: theme.typography.fontWeightRegular,
    '&:hover, &:focus': {
      backgroundColor: theme.palette.grey[300],
    },
    '&:active': {
      boxShadow: theme.shadows[2],
      backgroundColor: emphasize(theme.palette.grey[300], 0.12),
    },
  },
}))(Chip);
const PageBreadcrumbs = ({ items, ...rest }) => {
  return (
    <Breadcrumbs className="bread-crumbs" aria-label="breadcrumb {...rest}">
      {items.map((item, index) =>
        item.isActive ? (
          <StyledBreadcrumb key={index} component="a" label={item.label} icon={item?.icon} />
        ) : (
          <StyledBreadcrumb key={index} component="a" href={item.link || '/'} label={item.label} icon={item?.icon} />
        ),
      )}
    </Breadcrumbs>
  );
};

export default PageBreadcrumbs;
