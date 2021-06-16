import Accounts from 'component/Application/Accounts';
import Dashboard from 'component/Application/Dashboard';
import Orders from 'component/Application/Orders';
import Products from 'component/Application/Products';
import TestPage from 'component/Application/Test';
import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router';
import { useLocation } from 'react-router-dom';
import ForgotPasswordPage from '../component/Auth/ForgotPassword';
import Login from '../component/Auth/Login';
import Register from '../component/Auth/Register';
import Error404 from '../component/Error/404';

const RestrictedRoute = ({ component: Component, ...rest }) => {
  const { authUser } = useSelector(({ auth }) => auth);
  return (
    <Route
      {...rest}
      render={props =>
        authUser ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: '/signin',
              state: { from: props.location }
            }}
          />
        )
      }
    />
  );
};

const Routes = () => {
  const { authUser } = useSelector(({ auth }) => auth);
  const location = useLocation();

  if ((authUser && location.pathname === '') || location.pathname === '/') {
    return <Redirect to={'/dashboard'} />;
  } else if (authUser && location.pathname === '/signin') {
    return <Redirect to={'/dashboard'} />;
  } else if (!authUser && (location.pathname === '/signin/' || location.pathname === '/')) {
    return <Redirect to={'/signin'} />;
  }

  return (
    <React.Fragment>
      <Switch>
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/accounts" component={Accounts} />
        <Route path="/orders" component={Orders} />
        <Route path="/products" component={Products} />

        <Route path="/test" component={TestPage} />
        <Route path="/signin" component={Login} />
        <Route path="/signup" component={Register} />
        <Route path="/forgot-password" component={ForgotPasswordPage} />
        <Route component={Error404} />
      </Switch>
    </React.Fragment>
  );
};

export default Routes;
