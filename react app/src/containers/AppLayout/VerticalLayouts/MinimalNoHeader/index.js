import CmtVerticalLayout from '@coremat/CmtLayouts/Vertical';
import CmtContent from '@coremat/CmtLayouts/Vertical/Content';
import CmtHeader from '@coremat/CmtLayouts/Vertical/Header';
import CmtSidebar from '@coremat/CmtLayouts/Vertical/Sidebar';
import SidebarToggleHandler from '@coremat/CmtLayouts/Vertical/SidebarToggleHandler';
import { Hidden } from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';
import clsx from 'clsx';
import React, { useContext } from 'react';
import { HEADER_TYPE, SIDEBAR_TYPE } from '../../../../constants/ThemeOptions';
import ContentLoader from '../../../ContentLoader';
import AppContext from '../../../contextProvider/AppContextProvider/AppContext';
import SideBar from '../../partials/SideBar';
import SidebarHeader from '../../partials/SidebarHeader';
import Alerts from './Alerts';


const useStyles = makeStyles(theme => ({
  minimalNoHeader: {
    backgroundColor: 'transparent',
    boxShadow: 'none',
    '& .Cmt-toggle-menu': {
      color: theme.palette.text.primary,
      marginLeft: 15
    }
  }
}));

const MinimalNoHeader = ({ className, children }) => {
  const classes = useStyles();
  const { drawerBreakPoint, isSidebarFixed, sidebarStyle, sidebarSize } = useContext(AppContext);

  return (
    <CmtVerticalLayout
      drawerBreakPoint={drawerBreakPoint}
      className={clsx('verticalMinimalNoHeaderLayout', className)}
      sidebarWidth={sidebarSize}>
      <CmtHeader className={classes.minimalNoHeader} type={HEADER_TYPE.STATIC}>
        <Hidden lgUp>
          <SidebarToggleHandler edge="start" color="inherit" aria-label="menu" />
        </Hidden>
        <Alerts />
      </CmtHeader>
      <CmtSidebar type={SIDEBAR_TYPE.MINI} isSidebarFixed={isSidebarFixed} {...sidebarStyle}>
        <SidebarHeader />
        <SideBar />
      </CmtSidebar>
      <CmtContent>
        {children}
        <ContentLoader />
      </CmtContent>
    </CmtVerticalLayout>
  );
};

export default MinimalNoHeader;
