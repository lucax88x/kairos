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
import { history, store } from './createStore';
import { Dashboard } from './dashboard/Dashboard';
import { enqueueSnackbarAction } from './notification-manager/enqueue-snackbar';
import { NotificationManager } from './notification-manager/NotificationManager.container';
import { Routes } from './routes';
import * as serviceWorker from './serviceWorker';

const theme = createMuiTheme({
  palette: {
    type: 'dark',
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
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider
        maxSnack={3}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <NotificationManager />
      </SnackbarProvider>

      <App>
        <ConnectedRouter history={history}>
          <AnimatedSwitch {...pageTransitions} mapStyles={mapStyles} className="switch-wrapper">
            <Route exact={true} path={Routes.Dashboard} component={Dashboard} />
          </AnimatedSwitch>
        </ConnectedRouter>
      </App>
    </ThemeProvider>
  </Provider>,
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