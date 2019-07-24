import {
  AppBar,
  Avatar,
  Container,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  SwipeableDrawer,
  Toolbar,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import DashboardIcon from '@material-ui/icons/Dashboard';
import MenuIcon from '@material-ui/icons/Menu';
import TimerIcon from '@material-ui/icons/Timer';
import clsx from 'clsx';
import React, { useCallback, useState } from 'react';
import { Link, Route } from 'react-router-dom';

import { CreateTimeEntry } from './CreateTimeEntry.container';
import { Dashboard } from './dashboard/Dashboard';
import { EditTimeEntry } from './edit-time-entry/EditTimeEntry.container';
import { UserModel } from './models/user.model';
import { Routes } from './routes';

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarLeftIcon: {
    display: 'grid',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  toolbarRightIcon: {
    display: 'grid',
    alignItems: 'center',
    justifyContent: 'flex-start',
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
  fixedHeight: {
    height: 240,
  },
  link: {
    color: 'inherit',
    textDecoration: 'none',
  },
  avatar: {
    margin: 10,
    cursor: 'pointer',
  },
}));

export interface AppInputs {
  isLeftDrawerOpen: boolean;
  isRightDrawerOpen: boolean;
  user: UserModel;
}

export interface AppDispatches {
  openLeftDrawer: () => void;
  closeLeftDrawer: () => void;
  openRightDrawer: () => void;
  closeRightDrawer: () => void;
  logout: () => void;
}

export type AppProps = AppInputs & AppDispatches;

export const AppComponent: React.FC<AppProps> = props => {
  const {
    user,
    isLeftDrawerOpen,
    openLeftDrawer,
    closeLeftDrawer,
    isRightDrawerOpen,
    openRightDrawer,
    closeRightDrawer,
    logout,
  } = props;

  const classes = useStyles(props);

  const handleLeftDrawerOpen = useCallback(() => openLeftDrawer(), [openLeftDrawer]);

  const handleLeftDrawerClose = useCallback(() => closeLeftDrawer(), [closeLeftDrawer]);

  const [userMenuEl, setUserMenuEl] = useState<Element | null>(null);

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
      openRightDrawer();
    },
    [openRightDrawer, shouldSkipSwipe],
  );

  const handleRightDrawerClose = useCallback(
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (shouldSkipSwipe(event)) {
        return;
      }
      closeRightDrawer();
    },
    [closeRightDrawer, shouldSkipSwipe],
  );

  const handleUserMenuOpen = useCallback(
    (event: React.KeyboardEvent | React.MouseEvent) => setUserMenuEl(event.currentTarget),
    [setUserMenuEl],
  );

  const handleUserMenuClose = useCallback(
    (event: React.KeyboardEvent | React.MouseEvent) => setUserMenuEl(null),
    [setUserMenuEl],
  );

  return (
    <div className={classes.root}>
      <AppBar
        position="absolute"
        className={clsx(classes.appBar, isLeftDrawerOpen && classes.appBarShift)}
      >
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="Open menu"
            onClick={handleLeftDrawerOpen}
            className={clsx(classes.menuButton, isLeftDrawerOpen && classes.menuButtonHidden)}
          >
            <MenuIcon />
          </IconButton>
          <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
            <Link to={Routes.Dashboard} className={classes.link}>
              kairos
            </Link>
          </Typography>
          <IconButton color="inherit" aria-label="Open time" onClick={handleRightDrawerOpen}>
            <TimerIcon />
          </IconButton>

          <Avatar
            alt={user.given_name}
            src={user.picture}
            className={classes.avatar}
            onClick={handleUserMenuOpen}
          />

          <Menu
            anchorEl={userMenuEl}
            keepMounted
            open={Boolean(userMenuEl)}
            onClose={handleUserMenuClose}
          >
            <MenuItem onClick={handleUserMenuClose}>Profile</MenuItem>
            <MenuItem onClick={logout}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !isLeftDrawerOpen && classes.drawerPaperClose),
        }}
        open={isLeftDrawerOpen}
      >
        <div className={classes.toolbarLeftIcon}>
          <IconButton onClick={handleLeftDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <List>
          <ListItem button to={Routes.Dashboard} component={Link}>
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
        </List>
      </Drawer>
      <SwipeableDrawer
        anchor="right"
        open={isRightDrawerOpen}
        onClose={handleRightDrawerClose}
        onOpen={handleRightDrawerOpen}
      >
        <div className={classes.toolbarRightIcon}>
          <IconButton onClick={handleRightDrawerClose}>
            <ChevronRightIcon />
          </IconButton>
        </div>
        <Divider />
        <CreateTimeEntry />
      </SwipeableDrawer>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Route exact={true} path={Routes.Dashboard} component={Dashboard} />
          <Route path={Routes.EditTimeEntry} component={EditTimeEntry} />
        </Container>
      </main>
    </div>
  );
};
