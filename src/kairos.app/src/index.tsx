import { createMuiTheme, CssBaseline } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import { ConnectedRouter } from 'connected-react-router';
import { SnackbarProvider } from 'notistack';
import React from 'react';
import ReactDOM from 'react-dom';
import { spring } from 'react-motion';
import { Provider } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';
import { AnimatedSwitch, IAnimatedSwitchTransition } from 'react-router-transition';
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

function mapStyles(styles: IAnimatedSwitchTransition) {
  return {
    opacity: styles.opacity,
    transform: `translateX(${styles.offset}px)`,
  };
}

function glide(val: number) {
  return spring(val, {
    stiffness: 140,
    damping: 35,
  });
}

const pageTransitions = {
  atEnter: {
    opacity: 0,
    offset: 100,
  },
  atLeave: {
    opacity: 0,
    offset: glide(-100),
  },
  atActive: {
    opacity: 1,
    offset: glide(0),
  },
};

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
              <AnimatedSwitch {...pageTransitions} mapStyles={mapStyles} className="switch-wrapper">
                <Redirect exact={true} from="/" to={Routes.Dashboard} />
                <Route path={Routes.Login} component={LoginForm} />
                <Route path="" component={App} />
                <Route component={NotFound} />
              </AnimatedSwitch>
            </ConnectedRouter>
          </ThemeProvider>
        </I18nLoader>
      </PersistGate>
    </Provider>
  </ErrorBoundary>,
  document.getElementById('root'),
);

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
