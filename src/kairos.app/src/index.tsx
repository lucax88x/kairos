import './index.scss';

import { createMuiTheme, CssBaseline } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import { ConnectedRouter } from 'connected-react-router';
import { SnackbarProvider } from 'notistack';
import React from 'react';
import ReactDOM from 'react-dom';
import { spring } from 'react-motion';
import { Provider } from 'react-redux';
import { Route } from 'react-router-dom';
import { AnimatedSwitch, IAnimatedSwitchTransition } from 'react-router-transition';

import { App } from './App.container';
import { Login } from './auth/Login.container';
import { Colors } from './code/variables';
import { ErrorBoundary } from './components/ErrorBoundary';
import { history, store } from './createStore';
import { NotFound } from './NotFound';
import { enqueueSnackbarAction } from './notification-manager/enqueue-snackbar';
import { NotificationManager } from './notification-manager/NotificationManager.container';
import { Routes } from './routes';
import * as serviceWorker from './serviceWorker';

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: Colors.Main,
      contrastText: 'white',
    },
    secondary: { main: '#11cb5f' },
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
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider
          maxSnack={3}
          preventDuplicate={true}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <NotificationManager />
        </SnackbarProvider>

        <ConnectedRouter history={history}>
          <AnimatedSwitch {...pageTransitions} mapStyles={mapStyles} className="switch-wrapper">
            <Route path={Routes.Login} component={Login} />
            <Route path="" component={App} />
            <Route component={NotFound} />
          </AnimatedSwitch>
        </ConnectedRouter>
      </ThemeProvider>
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
