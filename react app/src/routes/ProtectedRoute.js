import Error404 from 'component/Error/404';
import React from 'react';
import { Route } from 'react-router';

const ProtectedRoute = ({ component: Component, isAuthenticated: IsAuthenticated, ...rest }) => {
  return <Route {...rest} render={props => (IsAuthenticated ? <Component {...props} /> : <Route component={Error404} />)} />;
};

export default ProtectedRoute;
