import { t, Trans } from '@lingui/macro';
import { AppBar, Avatar, Box, Container, Divider, Drawer, IconButton, List, ListItem, ListItemIcon, ListItemText, MenuItem, Select, SwipeableDrawer, Toolbar, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import BeachAccessIcon from '@material-ui/icons/BeachAccess';
import SyncAltIcon from '@material-ui/icons/SyncAlt';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import DashboardIcon from '@material-ui/icons/Dashboard';
import LogoutIcon from '@material-ui/icons/ExitToApp';
import FastForwardIcon from '@material-ui/icons/FastForward';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import MenuIcon from '@material-ui/icons/Menu';
import TimerIcon from '@material-ui/icons/Timer';
import WeekendIcon from '@material-ui/icons/Weekend';
import clsx from 'clsx';
import { getYear } from 'date-fns';
import { map } from 'ramda';
import React, { ChangeEvent, useCallback, useState } from 'react';
import { Link, Route, Switch } from 'react-router-dom';
import { ReactComponent as EnglishFlag } from './assets/images/en.svg';
import { ReactComponent as ItalianFlag } from './assets/images/it.svg';
import { ReactComponent as LogoIcon } from './assets/images/logo.svg';
import { BulkInsert } from './bulk-insert/BulkInsert';
import { isLanguage, isNumber } from './code/is';
import { isIOS } from './code/is-ios';
import { CreateTimeAbsenceEntry } from './CreateTimeAbsenceEntry.container';
import { CreateTimeEntry } from './CreateTimeEntry.container';
import { CreateTimeHolidayEntryModal } from './CreateTimeHolidayEntryModal.container';
import { Dashboard } from './dashboard/Dashboard';
import { EditTimeAbsenceEntry } from './edit-time-absence-entry/EditTimeAbsenceEntry.container';
import { EditTimeEntry } from './edit-time-entry/EditTimeEntry.container';
import { EditTimeHolidayEntry } from './edit-time-holiday-entry/EditTimeHolidayEntry.container';
import { Export } from './export/Export';
import { i18n } from './i18nLoader';
import { IsOnline } from './IsOnline.container';
import { Language, Languages } from './models/language-model';
import { UserModel } from './models/user.model';
import { Navigator } from './navigator/Navigator.container';
import { NotFound } from './NotFound';
import { Profile } from './profile/Profile.container';
import { buildPrivateRouteWithYear, RouteMatcher } from './routes';
import { ConfirmationModal } from './shared/ConfirmationModal.container';
import { TimeAbsenceEntries } from './time-absence-entries/TimeAbsenceEntries.container';
import { TimeEntries } from './time-entries/TimeEntries.container';
import { TimeHolidayEntries } from './time-holiday-entries/TimeHolidayEntries.container';
import version from './version.json';

const drawerWidth = 240;

const currentYear = getYear(new Date());

const years: number[] = [];
for (let i = -10; i < 3; i++) {
  years.push(currentYear + i);
}

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    overflowY: 'auto',
    overflowX: 'hidden',
  },
  logo: {
    width: 40,
  },
  topbarSelect: {
    textAlign: 'center',
  },
  topbarSelectOption: {
    justifyContent: 'center',
    padding: theme.spacing(1),
  },
  topbarText: {
    textAlign: 'center',
  },
  languageFlag: {
    width: 20,
  },
  toolbar: {
    paddingRight: 16,
    paddingLeft: 16,
    [theme.breakpoints.up('md')]: {
      paddingRight: 24,
      paddingLeft: 24,
    },
  },
  toolbarContent: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gridAutoFlow: 'column',
  },
  toolbarContentLeft: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gridAutoFlow: 'column',
  },
  toolbarContentRight: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gridAutoFlow: 'column',
  },
  toolbarLeftIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  toolbarRightIcon: {
    display: 'flex',
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
  appBarLeftShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  appBarRightShift: {
    marginRight: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  title: {
    flexGrow: 1,
    marginLeft: theme.spacing(2),
  },
  rightDrawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  rightDrawerPaper: {
    width: drawerWidth,
  },
  leftDrawerPaper: {
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
    display: 'grid',
    width: '100%',
    flexDirection: 'column',
    flexGrow: 1,
    overflow: 'auto',
    marginRight: -drawerWidth,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
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
  user: UserModel;
  selectedLanguage: Language;
  selectedYear: number;
  isLeftDrawerOpen: boolean;
  isRightDrawerOpen: boolean;
  isTimeEntryDrawerOpen: boolean;
  isTimeAbsenceEntryDrawerOpen: boolean;
}

export interface AppDispatches {
  onSelectYear: (year: number) => void;
  onSelectLanguage: (language: Language) => void;
  openLeftDrawer: () => void;
  closeLeftDrawer: () => void;
  openRightDrawer: () => void;
  closeRightDrawer: () => void;
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
    selectedLanguage,
    selectedYear,
    isLeftDrawerOpen,
    isRightDrawerOpen,
    openLeftDrawer,
    closeLeftDrawer,
    openRightDrawer,
    closeRightDrawer,
    isTimeEntryDrawerOpen,
    isTimeAbsenceEntryDrawerOpen,
    openTimeEntryDrawer,
    closeTimeEntryDrawer,
    openTimeAbsenceEntryDrawer,
    closeTimeAbsenceEntryDrawer,
    onLogout,
    onSelectYear,
    onSelectLanguage,
  } = props;

  const classes = useStyles(props);

  const handleLeftDrawerOpen = useCallback(() => openLeftDrawer(), [
    openLeftDrawer,
  ]);
  const handleLeftDrawerClose = useCallback(() => closeLeftDrawer(), [
    closeLeftDrawer,
  ]);

  const handleRightDrawerOpen = useCallback(() => openRightDrawer(), [
    openRightDrawer,
  ]);
  const handleRightDrawerClose = useCallback(() => closeRightDrawer(), [
    closeRightDrawer,
  ]);

  const [language, setLanguage] = useState<Language>(selectedLanguage);
  const [year, setYear] = useState<number>(selectedYear);

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

  const handleYearChange = useCallback(
    (event: ChangeEvent<{ value: unknown }>) => {
      if (isNumber(event.target.value)) {
        setYear(event.target.value);
        onSelectYear(event.target.value);
      }
    },
    [setYear, onSelectYear],
  );

  const handleLanguageChange = useCallback(
    (event: ChangeEvent<{ value: unknown }>) => {
      if (isLanguage(event.target.value)) {
        setLanguage(event.target.value);
        onSelectLanguage(event.target.value);
      }
    },
    [setLanguage, onSelectLanguage],
  );

  const getFlag = useCallback(
    (language: Language) => {
      switch (language) {
        case 'it':
          return <ItalianFlag className={classes.languageFlag} />;
        default:
        case 'en':
          return <EnglishFlag className={classes.languageFlag} />;
      }
    },
    [classes],
  );

  return (
    <>
      <div className={classes.root}>
        <AppBar
          position="absolute"
          className={clsx(
            classes.appBar,
            isLeftDrawerOpen && classes.appBarLeftShift,
            isRightDrawerOpen && classes.appBarRightShift,
          )}
        >
          <Toolbar className={classes.toolbar}>
            <div className={classes.toolbarContent}>
              <div className={classes.toolbarContentLeft}>
                {!isLeftDrawerOpen && (
                  <IconButton
                    edge="start"
                    color="inherit"
                    aria-label={i18n._(t`Open Menu`)}
                    onClick={handleLeftDrawerOpen}
                  >
                    <MenuIcon />
                  </IconButton>
                )}
                <Link to={buildPrivateRouteWithYear(RouteMatcher.Dashboard, selectedYear)}>
                  <LogoIcon className={classes.logo} />
                </Link>
                <Box component="div" display={{ xs: 'none', sm: 'block' }}>
                  <Typography
                    component="h1"
                    variant="h6"
                    color="inherit"
                    noWrap
                    className={classes.title}
                  >
                    <Link to={buildPrivateRouteWithYear(RouteMatcher.Dashboard, selectedYear)} className={classes.link}>
                      kairos
                    </Link>
                  </Typography>
                </Box>
              </div>
              <div className={classes.toolbarContentRight}>
                {!isRightDrawerOpen && !isLeftDrawerOpen && (
                  <IsOnline></IsOnline>
                )}
                {!isRightDrawerOpen && !isLeftDrawerOpen && (
                  <IconButton
                    id="hint-time-entry-button"
                    color="inherit"
                    aria-label={i18n._(t`Open time entry`)}
                    onClick={handleTimeEntryDrawerOpen}
                  >
                    <TimerIcon />
                  </IconButton>
                )}
                {!isRightDrawerOpen && !isLeftDrawerOpen && (
                  <IconButton
                    color="inherit"
                    aria-label={i18n._(t`Open absence`)}
                    onClick={handleTimeAbsenceEntryDrawerOpen}
                  >
                    <WeekendIcon />
                  </IconButton>
                )}
                {!isRightDrawerOpen && (
                  <Avatar
                    alt={user.name}
                    src={user.picture}
                    className={classes.avatar}
                    onClick={handleRightDrawerOpen}
                  />
                )}
              </div>
            </div>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="persistent"
          classes={{
            paper: clsx(
              classes.leftDrawerPaper,
              !isLeftDrawerOpen && classes.drawerPaperClose,
            ),
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
            <ListItem button to={buildPrivateRouteWithYear(RouteMatcher.Dashboard, selectedYear)} component={Link}>
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary={<Trans>Dashboard</Trans>} />
            </ListItem>
            <ListItem button to={buildPrivateRouteWithYear(RouteMatcher.Navigator, selectedYear)} component={Link}>
              <ListItemIcon>
                <SyncAltIcon />
              </ListItemIcon>
              <ListItemText primary={<Trans>Navigator</Trans>} />
            </ListItem>
            <Divider />
            <ListItem button to={buildPrivateRouteWithYear(RouteMatcher.TimeEntries, selectedYear)} component={Link}>
              <ListItemIcon>
                <TimerIcon />
              </ListItemIcon>
              <ListItemText primary={<Trans>Time Entries</Trans>} />
            </ListItem>
            <ListItem button to={buildPrivateRouteWithYear(RouteMatcher.TimeAbsenceEntries, selectedYear)} component={Link}>
              <ListItemIcon>
                <WeekendIcon />
              </ListItemIcon>
              <ListItemText primary={<Trans>Absences</Trans>} />
            </ListItem>
            <ListItem button to={buildPrivateRouteWithYear(RouteMatcher.TimeHolidayEntries, selectedYear)} component={Link}>
              <ListItemIcon>
                <BeachAccessIcon />
              </ListItemIcon>
              <ListItemText primary={<Trans>Holidays</Trans>} />
            </ListItem>
            <Divider />
            <ListItem button to={RouteMatcher.BulkInsert} component={Link}>
              <ListItemIcon>
                <FastForwardIcon />
              </ListItemIcon>
              <ListItemText primary={<Trans>Bulk Insert</Trans>} />
            </ListItem>
            <ListItem button to={RouteMatcher.Export} component={Link}>
              <ListItemIcon>
                <InsertDriveFileIcon />
              </ListItemIcon>
              <ListItemText primary={<Trans>Export</Trans>} />
            </ListItem>
          </List>
        </Drawer>

        <main className={classes.content}>
          <div className={classes.appBarSpacer} />
          <Container
            component="main"
            maxWidth="lg"
            className={classes.container}
          >
            <Switch>
              <Route path={RouteMatcher.Dashboard} component={Dashboard} />
              <Route path={RouteMatcher.Navigator} component={Navigator} />
              <Route path={RouteMatcher.Profile} component={Profile} />
              <Route path={RouteMatcher.TimeEntries} component={TimeEntries} />
              <Route
                path={RouteMatcher.TimeAbsenceEntries}
                component={TimeAbsenceEntries}
              />
              <Route
                path={RouteMatcher.TimeHolidayEntries}
                component={TimeHolidayEntries}
              />
              <Route path={RouteMatcher.EditTimeEntry} component={EditTimeEntry} />
              <Route
                path={RouteMatcher.EditTimeAbsenceEntry}
                component={EditTimeAbsenceEntry}
              />
              <Route
                path={RouteMatcher.EditTimeHolidayEntry}
                component={EditTimeHolidayEntry}
              />
              <Route path={RouteMatcher.BulkInsert} component={BulkInsert} />
              <Route path={RouteMatcher.Export} component={Export} />
              <Route path="*" component={NotFound} />
            </Switch>
          </Container>
        </main>

        <Drawer
          variant="persistent"
          className={classes.rightDrawer}
          classes={{ paper: clsx(classes.rightDrawerPaper) }}
          anchor="right"
          open={isRightDrawerOpen}
        >
          <div className={classes.toolbarRightIcon}>
            <IconButton onClick={handleRightDrawerClose}>
              <ChevronRightIcon />
            </IconButton>
          </div>
          <Divider />
          <List>
            <ListItem button to={RouteMatcher.Profile} component={Link}>
              <ListItemIcon>
                <Avatar
                  alt={user.name}
                  src={user.picture}
                  // className={classes.avatar}
                />
              </ListItemIcon>
              <ListItemText primary={<Trans>Profile</Trans>} />
            </ListItem>
            <Divider />
            <ListItem button onClick={handleTimeEntryDrawerOpen}>
              <ListItemIcon>
                <TimerIcon />
              </ListItemIcon>
              <ListItemText primary={<Trans>Open time entry</Trans>} />
            </ListItem>
            <ListItem button onClick={handleTimeAbsenceEntryDrawerOpen}>
              <ListItemIcon>
                <WeekendIcon />
              </ListItemIcon>
              <ListItemText primary={<Trans>Open absence</Trans>} />
            </ListItem>
            <Divider />
            <ListItem>
              <Select
                fullWidth
                value={year}
                onChange={handleYearChange}
                className={classes.topbarSelect}
              >
                {map(
                  year => (
                    <MenuItem
                      key={year}
                      value={year}
                      className={classes.topbarSelectOption}
                    >
                      {year}
                    </MenuItem>
                  ),
                  years,
                )}
              </Select>
            </ListItem>
            <Divider />
            <ListItem>
              <Select
                fullWidth
                value={language}
                onChange={handleLanguageChange}
                className={classes.topbarSelect}
              >
                {map(
                  language => (
                    <MenuItem
                      key={language}
                      value={language}
                      className={classes.topbarSelectOption}
                    >
                      {getFlag(language)}
                    </MenuItem>
                  ),
                  Languages,
                )}
              </Select>
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText
                className={classes.topbarText}
                primary={i18n._(t`Version ${version.version}`)}
              />
            </ListItem>
            <ListItem button onClick={onLogout}>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary={<Trans>Logout</Trans>} />
            </ListItem>
          </List>
        </Drawer>
        <SwipeableDrawer
          anchor="right"
          open={isTimeEntryDrawerOpen}
          onClose={handleTimeEntryDrawerClose}
          onOpen={handleTimeEntryDrawerOpen}
          disableBackdropTransition={!isIOS}
          disableDiscovery={isIOS}
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
          disableBackdropTransition={!isIOS}
          disableDiscovery={isIOS}
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
        <ConfirmationModal />
      </div>
    </>
  );
};
