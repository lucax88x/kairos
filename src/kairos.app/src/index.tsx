import { createMuiTheme, CssBaseline } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import { ConnectedRouter } from 'connected-react-router';
import { SnackbarProvider } from 'notistack';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';
import { App } from './App.container';
import { LoginForm } from './auth/LoginForm.container';
import { Themes } from './code/variables';
import { ErrorBoundary } from './components/ErrorBoundary';
import { SpinnerIcon } from './components/SpinnerIcon';
import { history, persistor, store } from './createStore';
import { I18nLoader } from './i18nLoader.container';
import './index.scss';
import { NotFound } from './NotFound';
import { enqueueSnackbarAction } from './notification-manager/enqueue-snackbar';
import { NotificationManager } from './notification-manager/NotificationManager.container';
import { Routes } from './routes';
import * as serviceWorker from './serviceWorker';

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: Themes.First.backgroundColor,
      contrastText: Themes.First.color,
    },
    secondary: { main: Themes.Second.backgroundColor, contrastText: Themes.Second.color },
  },
});

ReactDOM.render(
  <ErrorBoundary>
    <Provider store={store}>
      <PersistGate loading={<SpinnerIcon />} persistor={persistor}>
        <I18nLoader>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <SnackbarProvider
              maxSnack={3}
              preventDuplicate={true}
              autoHideDuration={5000}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <NotificationManager />
            </SnackbarProvider>

            <ConnectedRouter history={history}>
              <Switch>
                <Redirect exact={true} from="/" to={Routes.Dashboard} />
                <Route path={Routes.Login} component={LoginForm} />
                <Route path="" component={App} />
                <Route component={NotFound} />
              </Switch>
            </ConnectedRouter>
          </ThemeProvider>
        </I18nLoader>
      </PersistGate>
    </Provider>
  </ErrorBoundary>,
  document.getElementById('root'),
);

console.log('prova i18n')
serviceWorker.register({
  onSuccess: () => {
    store.dispatch(enqueueSnackbarAction('Content is cached for offline use.'));
  },
  onUpdate: () => {
    store.dispatch(
      enqueueSnackbarAction(
        'New content is available and will be used when all tabs for this page are closed.',
        { variant: 'warning' },
      ),
    );
  },
});
