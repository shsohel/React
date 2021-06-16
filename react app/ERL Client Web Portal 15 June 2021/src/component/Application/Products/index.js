import { products } from 'constants/PermissionsType';
import PageLoader from 'containers/PageComponents/PageLoader';
import React, { lazy, Suspense } from 'react';
import { useSelector } from 'react-redux';
import { Route, Switch } from 'react-router';

const Products = ({ match }) => {
  const { userPermission } = useSelector(({ auth }) => auth);
  const hasProductViewPermission = userPermission?.includes(products.VIEW);

  const requestedUrl = match.url.replace(/\/$/, '');
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <Route exact path={`${requestedUrl}/list`} component={lazy(() => import('./ProductList'))} />
        {/* <ProtectedRoute
          exact
          path={`${requestedUrl}/list`}
          component={lazy(() => import('./ProductList'))}
          isAuthenticated={hasProductViewPermission}
        /> */}
      </Switch>
    </Suspense>
  );
};

export default Products;
