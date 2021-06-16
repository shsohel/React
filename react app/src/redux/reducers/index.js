import { connectRouter } from 'connected-react-router';
import { combineReducers } from 'redux';
import Auth from './Auth';
import Common from './Common';
import Employee from './Employee';

export default history =>
  combineReducers({
    router: connectRouter(history),
    common: Common,
    auth: Auth,
    employee: Employee
  });
