import { t } from '@lingui/macro';
import { Avatar, Box, Button, Container, createMuiTheme, CssBaseline, IconButton, Typography } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles, ThemeProvider } from '@material-ui/styles';
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
import { SimpleIcon } from './components/SimpleIcon';
import { SpinnerIcon } from './components/SpinnerIcon';
import { history, persistor, store } from './createStore';
import { i18n } from './i18nLoader';
import { I18nLoader } from './i18nLoader.container';
import './index.scss';
import { NotFound } from './NotFound';
import { enqueueSnackbarAction } from './notification-manager/enqueue-snackbar';
import { NotificationManager } from './notification-manager/NotificationManager.container';
import { buildPrivateRouteWithYear, RouteMatcher } from './routes';
import * as serviceWorker from './serviceWorker';
import { selectSelectedYear } from './shared/selectors';

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: Themes.First.backgroundColor,
      contrastText: Themes.First.color,
    },
    secondary: {
      main: Themes.Second.backgroundColor,
      contrastText: Themes.Second.color,
    },
  },
  overrides: {
    MuiButton: {
      textPrimary: {
        color: Themes.First.color,
      },
    },
    MuiFormLabel: {
      root: {
        '&$focused': {
          color: Themes.Second.backgroundColor,
        },
      },
    },
    MuiInput: {
      underline: {
        '&:after': {
          borderBottom: `2px solid ${Themes.Second.backgroundColor}`,
        },
      },
    },
    MuiExpansionPanelSummary: {
      root: {
        '&$focused': {
          backgroundColor: Themes.Second.backgroundColor,
        },
      },
    },
  },
});

const useStyles = makeStyles(() => ({
  success: { color: 'white' },
  error: { color: 'white' },
  root: {
    display: 'grid',
    height: '100vh',
    width: '100vw',
  },
  footerAvatar: {
    width: 24,
    height: 24,
  },
  footerIcon: {
    width: 24,
    height: 24,
  },
  footerRoot: {
    backgroundColor: theme.palette.background.paper,
    marginTop: 'auto',
  },
  footerContainer: {
    padding: theme.spacing(1),
  },
  footer: {
    display: 'grid',
    alignItems: 'center',
    gridGap: theme.spacing(1),
    gridAutoFlow: 'column',
  },
  footerLinks: {
    display: 'grid',
    gridAutoFlow: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gridGap: theme.spacing(1),

    [theme.breakpoints.up('md')]: {
      gridGap: theme.spacing(2),
    },
  },
  footerLink: {
    display: 'grid',
  },
}));

const Index: React.FC = () => {
  const notistackRef = React.createRef<{
    handleDismissSnack: (key: string) => void;
  }>();

  const onClickDismiss = useCallback(
    (key: string) =>
      !!notistackRef.current && notistackRef.current.handleDismissSnack(key),
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

              <div className={classes.root}>
                <ConnectedRouter history={history}>
                  <Switch>
                    <Redirect
                      exact={true}
                      from="/"
                      to={buildPrivateRouteWithYear(
                        RouteMatcher.Dashboard,
                        selectSelectedYear(store.getState()),
                      )}
                    />
                    <Route path={RouteMatcher.Login} component={LoginForm} />
                    <Route path={RouteMatcher.Private} component={App} />
                    <Route
                      path={RouteMatcher.PrivateWithYear}
                      component={App}
                    />
                    <Route path="*" component={NotFound} />
                  </Switch>
                </ConnectedRouter>

                <footer className={classes.footerRoot}>
                  <Container maxWidth="lg" className={classes.footerContainer}>
                    <div className={classes.footer}>
                      <div className={classes.footerLinks}>
                        <Box
                          component="div"
                          display={{ xs: 'none', md: 'block' }}
                        >
                          <Typography
                            variant="subtitle1"
                            align="center"
                            color="textSecondary"
                            component="p"
                          >
                            From developer for developers with love!
                          </Typography>
                        </Box>
                        <a
                          href="https://github.com/lucax88x/kairos"
                          target="_blank"
                          rel="noopener noreferrer"
                          className={classes.footerLink}
                        >
                          <IconButton color="inherit" aria-label="Github">
                            <SimpleIcon
                              type="github"
                              className={classes.footerIcon}
                            ></SimpleIcon>
                          </IconButton>
                        </a>
                        <a
                          href="https://github.com/lucax88x/kairos/stargazers"
                          target="_blank"
                          rel="noopener noreferrer"
                          className={classes.footerLink}
                        >
                          <img
                            alt="preview badge"
                            src="https://img.shields.io/github/stars/lucax88x/kairos?style=for-the-badge"
                          ></img>
                        </a>
                        <Box
                          component="div"
                          display={{ xs: 'none', sm: 'block' }}
                        >
                          <a
                            href="https://github.com/lucax88x/kairos/issues"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={classes.footerLink}
                          >
                            <img
                              alt="preview badge"
                              src="https://img.shields.io/github/issues/lucax88x/kairos?style=for-the-badge"
                            ></img>
                          </a>
                        </Box>
                      </div>
                      <div className={classes.footerLinks}>
                        <a
                          href="https://lucax88x.github.io"
                          target="_blank"
                          rel="noopener noreferrer"
                          className={classes.footerLink}
                        >
                          <IconButton color="inherit" aria-label="Github.io">
                            <Avatar
                              className={classes.footerAvatar}
                              alt={'lucatrazzi'}
                              src={'https://lucax88x.github.io/img/author.jpg'}
                            />
                          </IconButton>
                        </a>

                        <a
                          href="https://github.com/lucax88x"
                          target="_blank"
                          rel="noopener noreferrer"
                          className={classes.footerLink}
                        >
                          <IconButton color="inherit" aria-label="Github">
                            <SimpleIcon
                              type="github"
                              className={classes.footerIcon}
                            ></SimpleIcon>
                          </IconButton>
                        </a>
                        <a
                          href="https://www.linkedin.com/in/luca-trazzi-93217931/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className={classes.footerLink}
                        >
                          <IconButton color="inherit" aria-label="Linkedin">
                            <SimpleIcon
                              type="linkedin"
                              className={classes.footerIcon}
                            ></SimpleIcon>
                          </IconButton>
                        </a>
                      </div>
                    </div>
                  </Container>
                </footer>
              </div>
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
    store.dispatch(
      enqueueSnackbarAction(i18n._(t`Content is cached for offline use.`)),
    );
  },
  onUpdate: () => {
    store.dispatch(
      enqueueSnackbarAction(
        i18n._(
          t`New content is available and will be used when all tabs for this page are closed.`,
        ),
        {
          variant: 'warning',
          action: (
            <Button onClick={() => window.location.reload(true)}>
              <CloseIcon />
            </Button>
          ),
        },
      ),
    );
  },
});
