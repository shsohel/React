import { liftingSchedules, orders } from 'constants/PermissionsType';
import PageLoader from 'containers/PageComponents/PageLoader';
import React, { lazy, Suspense } from 'react';
import { useSelector } from 'react-redux';
import { Route, Switch } from 'react-router';

const Orders = ({ match }) => {
  const { userPermission } = useSelector(({ auth }) => auth);
  const hasOrdersViewPermission = userPermission?.includes(orders.VIEW);
  const hasOrdersCreatePermission = userPermission?.includes(orders.CREATE);
  const hasOrdersEditPermission = userPermission?.includes(orders.EDIT);
  const hasOrdersConfirmationPermission = userPermission?.includes(orders.CREATE);
  const hasLiftingScheduleManagePermission = userPermission?.includes(liftingSchedules.CREATE);

  const requestedUrl = match.url.replace(/\/$/, '');
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <Route exact path={`${requestedUrl}/list`} component={lazy(() => import('./OrderList'))} />
        <Route exact path={`${requestedUrl}/new`} component={lazy(() => import('./OrderForm'))} />
        <Route exact path={`${requestedUrl}/edit`} component={lazy(() => import('./OrderEdit'))} />
        <Route exact path={`${requestedUrl}/order-confirmation`} component={lazy(() => import('./OrderConfirmation'))} />
        {/* <ProtectedRoute
          exact
          path={`${requestedUrl}/manage-schedule`}
          component={lazy(() => import('../LiftingSchedule/LiftingScheduleManage'))}
          isAuthenticated={hasLiftingScheduleManagePermission}
        /> */}
      </Switch>
    </Suspense>
  );
};

export default Orders;
