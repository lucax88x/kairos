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
import BeachAccessIcon from '@material-ui/icons/BeachAccess';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import DashboardIcon from '@material-ui/icons/Dashboard';
import FastForwardIcon from '@material-ui/icons/FastForward';
import MenuIcon from '@material-ui/icons/Menu';
import TimerIcon from '@material-ui/icons/Timer';
import WeekendIcon from '@material-ui/icons/Weekend';
import clsx from 'clsx';
import React, { useCallback, useState } from 'react';
import { Link, Redirect, Route } from 'react-router-dom';
import { ReactComponent as LogoIcon } from './assets/images/logo.svg';
import { BulkInsert } from './bulk-insert/BulkInsert';
import { CreateTimeAbsenceEntry } from './CreateTimeAbsenceEntry.container';
import { CreateTimeEntry } from './CreateTimeEntry.container';
import { CreateTimeHolidayEntryModal } from './CreateTimeHolidayEntryModal.container';
import { Dashboard } from './dashboard/Dashboard';
import { EditTimeAbsenceEntry } from './edit-time-absence-entry/EditTimeAbsenceEntry.container';
import { EditTimeEntry } from './edit-time-entry/EditTimeEntry.container';
import { UserModel } from './models/user.model';
import { Profile } from './profile/Profile.container';
import { Routes } from './routes';
import { TimeAbsenceEntries } from './time-absence-entries/TimeAbsenceEntries.container';
import { TimeEntries } from './time-entries/TimeEntries.container';
import { TimeHolidayEntries } from './time-holiday-entries/TimeHolidayEntries.container';

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  logo: {
    width: 40,
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
    marginLeft: theme.spacing(2),
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
  isTimeEntryDrawerOpen: boolean;
  isTimeAbsenceEntryDrawerOpen: boolean;
  user: UserModel;
}

export interface AppDispatches {
  openLeftDrawer: () => void;
  closeLeftDrawer: () => void;
  openTimeEntryDrawer: () => void;
  closeTimeEntryDrawer: () => void;
  openTimeAbsenceEntryDrawer: () => void;
  closeTimeAbsenceEntryDrawer: () => void;
  onLogout: () => void;
  onNavigateToProfile: () => void;
}

export type AppProps = AppInputs & AppDispatches;

export const AppComponent: React.FC<AppProps> = props => {
  const {
    user,
    isLeftDrawerOpen,
    openLeftDrawer,
    closeLeftDrawer,
    isTimeEntryDrawerOpen,
    isTimeAbsenceEntryDrawerOpen,
    openTimeEntryDrawer,
    closeTimeEntryDrawer,
    openTimeAbsenceEntryDrawer,
    closeTimeAbsenceEntryDrawer,
    onLogout,
    onNavigateToProfile,
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

  const handleTimeEntryDrawerOpen = useCallback(
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (shouldSkipSwipe(event)) {
        return;
      }
      openTimeEntryDrawer();
    },
    [openTimeEntryDrawer, shouldSkipSwipe],
  );

  const handleTimeEntryDrawerClose = useCallback(
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (shouldSkipSwipe(event)) {
        return;
      }
      closeTimeEntryDrawer();
    },
    [closeTimeEntryDrawer, shouldSkipSwipe],
  );

  const handleTimeAbsenceEntryDrawerOpen = useCallback(
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (shouldSkipSwipe(event)) {
        return;
      }
      openTimeAbsenceEntryDrawer();
    },
    [openTimeAbsenceEntryDrawer, shouldSkipSwipe],
  );

  const handleTimeAbsenceEntryDrawerClose = useCallback(
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (shouldSkipSwipe(event)) {
        return;
      }
      closeTimeAbsenceEntryDrawer();
    },
    [closeTimeAbsenceEntryDrawer, shouldSkipSwipe],
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

          <Link to={Routes.Dashboard}>
            <LogoIcon className={classes.logo} />
          </Link>

          <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
            <Link to={Routes.Dashboard} className={classes.link}>
              kairos
            </Link>
          </Typography>
          <IconButton
            color="inherit"
            aria-label="Open time absence entry"
            onClick={handleTimeAbsenceEntryDrawerOpen}
          >
            <WeekendIcon />
          </IconButton>
          <IconButton
            color="inherit"
            aria-label="Open time entry"
            onClick={handleTimeEntryDrawerOpen}
          >
            <TimerIcon />
          </IconButton>

          <Avatar
            alt={user.name}
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
            <MenuItem onClick={onNavigateToProfile}>Profile</MenuItem>
            <MenuItem onClick={onLogout}>Logout</MenuItem>
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
          <Divider />
          <ListItem button to={Routes.TimeEntries} component={Link}>
            <ListItemIcon>
              <TimerIcon />
            </ListItemIcon>
            <ListItemText primary="Time Entries" />
          </ListItem>
          <ListItem button to={Routes.TimeAbsenceEntries} component={Link}>
            <ListItemIcon>
              <WeekendIcon />
            </ListItemIcon>
            <ListItemText primary="Absences" />
          </ListItem>
          <ListItem button to={Routes.TimeHolidayEntries} component={Link}>
            <ListItemIcon>
              <BeachAccessIcon />
            </ListItemIcon>
            <ListItemText primary="Holidays" />
          </ListItem>
          <Divider />
          <ListItem button to={Routes.BulkInsert} component={Link}>
            <ListItemIcon>
              <FastForwardIcon />
            </ListItemIcon>
            <ListItemText primary="Bulk Insert" />
          </ListItem>
        </List>
      </Drawer>
      <SwipeableDrawer
        anchor="right"
        open={isTimeEntryDrawerOpen}
        onClose={handleTimeEntryDrawerClose}
        onOpen={handleTimeEntryDrawerOpen}
      >
        <div className={classes.toolbarRightIcon}>
          <IconButton onClick={handleTimeEntryDrawerClose}>
            <ChevronRightIcon />
          </IconButton>
        </div>
        <Divider />
        <CreateTimeEntry />
      </SwipeableDrawer>
      <SwipeableDrawer
        anchor="right"
        open={isTimeAbsenceEntryDrawerOpen}
        onClose={handleTimeAbsenceEntryDrawerClose}
        onOpen={handleTimeAbsenceEntryDrawerOpen}
      >
        <div className={classes.toolbarRightIcon}>
          <IconButton onClick={handleTimeAbsenceEntryDrawerClose}>
            <ChevronRightIcon />
          </IconButton>
        </div>
        <Divider />
        <CreateTimeAbsenceEntry />
      </SwipeableDrawer>
      <CreateTimeHolidayEntryModal />
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Route path={Routes.Dashboard} component={Dashboard} />
          <Route path={Routes.Profile} component={Profile} />
          <Route path={Routes.TimeEntries} component={TimeEntries} />
          <Route path={Routes.TimeAbsenceEntries} component={TimeAbsenceEntries} />
          <Route path={Routes.TimeHolidayEntries} component={TimeHolidayEntries} />
          <Route path={Routes.EditTimeEntry} component={EditTimeEntry} />
          <Route path={Routes.EditTimeAbsenceEntry} component={EditTimeAbsenceEntry} />
          <Route path={Routes.BulkInsert} component={BulkInsert} />
        </Container>
      </main>
    </div>
  );
};
