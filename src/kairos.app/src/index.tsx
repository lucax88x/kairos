import { t } from '@lingui/macro';
import { Button, createMuiTheme, CssBaseline } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { ThemeProvider, makeStyles } from '@material-ui/styles';
import { ConnectedRouter } from 'connected-react-router';
import { SnackbarProvider } from 'notistack';
import React, { useCallback } from 'react';
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
import { i18n } from './i18nLoader';
import { I18nLoader } from './i18nLoader.container';
import './index.scss';
import { NotFound } from './NotFound';
import { enqueueSnackbarAction } from './notification-manager/enqueue-snackbar';
import { NotificationManager } from './notification-manager/NotificationManager.container';
import { Routes } from './routes';
import * as serviceWorker from './serviceWorker';

const useStyles = makeStyles(() => ({
  success: { color: 'white' },
  error: { color: 'white' },
}));

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

const Index: React.FC = () => {
  const notistackRef = React.createRef<{ handleDismissSnack: (key: string) => void }>();

  const onClickDismiss = useCallback(
    (key: string) => !!notistackRef.current && notistackRef.current.handleDismissSnack(key),
    [notistackRef],
  );

  const snackbarAction = useCallback(
    (key: string) => (
      <Button onClick={() => onClickDismiss(key)}>
        <CloseIcon />
      </Button>
    ),
    [onClickDismiss],
  );

  const classes = useStyles();

  return (
    <ErrorBoundary>
      <Provider store={store}>
        <PersistGate loading={<SpinnerIcon />} persistor={persistor}>
          <I18nLoader>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <SnackbarProvider
                ref={notistackRef}
                maxSnack={3}
                classes={{
                  variantSuccess: classes.success,
                  variantError: classes.error,
                }}
                preventDuplicate={true}
                autoHideDuration={5000}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                style={{ top: '150px' }}
                action={snackbarAction}
                
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
    </ErrorBoundary>
  );
};

ReactDOM.render(<Index />, document.getElementById('root'));

serviceWorker.register({
  onSuccess: () => {
    store.dispatch(enqueueSnackbarAction(i18n._(t`Messages.ContentIsCached`)));
  },
  onUpdate: () => {
    store.dispatch(
      enqueueSnackbarAction(i18n._(t`Messages.NewContentAvailablePleaseRefresh`), {
        variant: 'warning',
      }),
    );
  },
});
