import {
  AppBar,
  Container,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  SwipeableDrawer,
  Toolbar,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import DashboardIcon from '@material-ui/icons/Dashboard';
import MenuIcon from '@material-ui/icons/Menu';
import TimerIcon from '@material-ui/icons/Timer';
import clsx from 'clsx';
import React, { useCallback, useState } from 'react';

import { CreateTimeEntry } from './CreateTimeEntry.container';

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
  },
}));

export interface AppProps {
  children: Node;
}

export const App: React.FC = props => {
  const { children } = props;
  const classes = useStyles(props);

  const [leftOpen, setLeftOpen] = useState(false);
  const [rightOpen, setRightOpen] = useState(false);

  const handleLeftDrawerOpen = useCallback(() => {
    setLeftOpen(true);
  }, [setLeftOpen]);

  const handleLeftDrawerClose = useCallback(() => {
    setLeftOpen(false);
  }, [setLeftOpen]);

  const shouldSkipSwipe = useCallback(
    (event: React.KeyboardEvent | React.MouseEvent) =>
      event &&
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift'),
    [],
  );

  const handleRightDrawerOpen = useCallback(
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (shouldSkipSwipe(event)) {
        return;
      }
      setRightOpen(true);
    },
    [setRightOpen, shouldSkipSwipe],
  );

  const handleRightDrawerClose = useCallback(
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (shouldSkipSwipe(event)) {
        return;
      }
      setRightOpen(false);
    },
    [setRightOpen, shouldSkipSwipe],
  );

  return (
    <div className={classes.root}>
      <AppBar position="absolute" className={clsx(classes.appBar, leftOpen && classes.appBarShift)}>
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="Open menu"
            onClick={handleLeftDrawerOpen}
            className={clsx(classes.menuButton, leftOpen && classes.menuButtonHidden)}
          >
            <MenuIcon />
          </IconButton>
          <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
            Dashboard
          </Typography>
          <IconButton color="inherit" aria-label="Open time" onClick={handleRightDrawerOpen}>
            <TimerIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !leftOpen && classes.drawerPaperClose),
        }}
        open={leftOpen}
      >
        <div className={classes.toolbarIcon}>
          <IconButton onClick={handleLeftDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <List>
          <div>
            <ListItem button>
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItem>
          </div>
        </List>
      </Drawer>
      <SwipeableDrawer
        anchor="right"
        open={rightOpen}
        onClose={handleRightDrawerClose}
        onOpen={handleRightDrawerOpen}
      >
        <CreateTimeEntry />
      </SwipeableDrawer>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          {children}
        </Container>
      </main>
    </div>
  );
};
