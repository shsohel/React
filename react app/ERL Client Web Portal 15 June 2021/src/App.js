import { ConnectedRouter } from 'connected-react-router';
import React from 'react';
import 'react-perfect-scrollbar/dist/css/styles.css';
import { Provider } from 'react-redux';
import { Switch } from 'react-router-dom';
import { ToastProvider } from 'react-toast-notifications';
import AppWrapper from './containers/AppWrapper';
import AppContextProvider from './containers/contextProvider/AppContextProvider';
import configureStore, { history } from './redux/store';
import Routes from './routes';

export const store = configureStore();

const App = () => (
  <AppContextProvider>
    <Provider store={store}>
      <ToastProvider autoDismiss autoDismissTimeout={2000}>
        <ConnectedRouter history={history}>
          <AppWrapper>
            <Switch>
              <Routes />
            </Switch>
          </AppWrapper>
        </ConnectedRouter>
      </ToastProvider>
    </Provider>
  </AppContextProvider>
);

export default App;
