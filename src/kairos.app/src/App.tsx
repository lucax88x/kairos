import { t, Trans } from '@lingui/macro';
import {
  AppBar,
  Avatar,
  Container,
  Divider,
  Drawer,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  SwipeableDrawer,
  Toolbar,
  Typography,
  Box,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import BeachAccessIcon from '@material-ui/icons/BeachAccess';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import DashboardIcon from '@material-ui/icons/Dashboard';
import FastForwardIcon from '@material-ui/icons/FastForward';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import MenuIcon from '@material-ui/icons/Menu';
import TimerIcon from '@material-ui/icons/Timer';
import WeekendIcon from '@material-ui/icons/Weekend';
import LogoutIcon from '@material-ui/icons/ExitToApp';
import clsx from 'clsx';
import { getYear } from 'date-fns';
import { map } from 'ramda';
import React, { ChangeEvent, useCallback, useState } from 'react';
import { Link, Route } from 'react-router-dom';
import { ReactComponent as EnglishFlag } from './assets/images/en.svg';
import { ReactComponent as ItalianFlag } from './assets/images/it.svg';
import { ReactComponent as LogoIcon } from './assets/images/logo.svg';
import { BulkInsert } from './bulk-insert/BulkInsert';
import { isLanguage, isNumber } from './code/is';
import { SimpleIcon } from './components/SimpleIcon';
import { CreateTimeAbsenceEntry } from './CreateTimeAbsenceEntry.container';
import { CreateTimeEntry } from './CreateTimeEntry.container';
import { CreateTimeHolidayEntryModal } from './CreateTimeHolidayEntryModal.container';
import { Dashboard } from './dashboard/Dashboard';
import { EditTimeAbsenceEntry } from './edit-time-absence-entry/EditTimeAbsenceEntry.container';
import { EditTimeEntry } from './edit-time-entry/EditTimeEntry.container';
import { EditTimeHolidayEntry } from './edit-time-holiday-entry/EditTimeHolidayEntry.container';
import { i18n } from './i18nLoader';
import { Language, Languages } from './models/language-model';
import { UserModel } from './models/user.model';
import { Profile } from './profile/Profile.container';
import { Routes } from './routes';
import { TimeAbsenceEntries } from './time-absence-entries/TimeAbsenceEntries.container';
import { TimeEntries } from './time-entries/TimeEntries.container';
import { TimeHolidayEntries } from './time-holiday-entries/TimeHolidayEntries.container';
import { ConfirmationModal } from './shared/ConfirmationModal.container';
import { isIOS } from './code/is-ios';
import { Export } from './export/Export';

const drawerWidth = 240;

const currentYear = getYear(new Date());

const years: number[] = [];
for (let i = -10; i < 3; i++) {
  years.push(currentYear + i);
}

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
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
  languageFlag: {
    width: 20,
  },
  footerAvatar: {
    width: 24,
    height: 24,
  },
  footerIcon: {
    width: 24,
    height: 24,
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
  menuButton: {
    marginRight: 36,
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
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    flexGrow: 1,
    overflow: 'auto',
    marginRight: -drawerWidth,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: 0,
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
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(0.5),
    marginTop: 'auto',
  },
  footerLinks: {
    display: 'grid',
    gridAutoFlow: 'column',
    gridGap: theme.spacing(2),
    justifyContent: 'center',
    alignItems: 'center',
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

  const handleLeftDrawerOpen = useCallback(() => openLeftDrawer(), [openLeftDrawer]);
  const handleLeftDrawerClose = useCallback(() => closeLeftDrawer(), [closeLeftDrawer]);

  const handleRightDrawerOpen = useCallback(() => openRightDrawer(), [openRightDrawer]);
  const handleRightDrawerClose = useCallback(() => closeRightDrawer(), [closeRightDrawer]);

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
            <Grid container>
              <Grid container item alignItems={'center'} justify={'flex-start'} xs={6}>
                {!isLeftDrawerOpen && (
                  <Grid item>
                    <IconButton
                      edge="start"
                      color="inherit"
                      aria-label={i18n._(t`TopBar.OpenMenu`)}
                      onClick={handleLeftDrawerOpen}
                      className={classes.menuButton}
                    >
                      <MenuIcon />
                    </IconButton>
                  </Grid>
                )}
                <Grid item>
                  <Link to={Routes.Dashboard}>
                    <LogoIcon className={classes.logo} />
                  </Link>
                </Grid>

                <Grid item>
                  <Box component="div" display={{ xs: 'none', sm: 'block' }}>
                    <Typography
                      component="h1"
                      variant="h6"
                      color="inherit"
                      noWrap
                      className={classes.title}
                    >
                      <Link to={Routes.Dashboard} className={classes.link}>
                        kairos
                      </Link>
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
              <Grid container item alignItems={'center'} justify={'flex-end'} xs={6}>
                <Grid item>
                  <Box component="div" display={{ xs: 'none', sm: 'block' }}>
                    <IconButton
                      color="inherit"
                      aria-label={i18n._(t`TopBar.OpenTimeAbsenceEntry`)}
                      onClick={handleTimeAbsenceEntryDrawerOpen}
                    >
                      <WeekendIcon />
                    </IconButton>
                  </Box>
                </Grid>
                <Grid item>
                  <Box component="div" display={{ xs: 'none', sm: 'block' }}>
                    <IconButton
                      color="inherit"
                      aria-label={i18n._(t`TopBar.OpenTimeEntry`)}
                      onClick={handleTimeEntryDrawerOpen}
                    >
                      <TimerIcon />
                    </IconButton>
                  </Box>
                </Grid>
                {!isRightDrawerOpen && (
                  <Grid item>
                    <Avatar
                      alt={user.name}
                      src={user.picture}
                      className={classes.avatar}
                      onClick={handleRightDrawerOpen}
                    />
                  </Grid>
                )}
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          classes={{
            paper: clsx(classes.leftDrawerPaper, !isLeftDrawerOpen && classes.drawerPaperClose),
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
              <ListItemText primary={<Trans>LeftMenu.Dashboard</Trans>} />
            </ListItem>
            <Divider />
            <ListItem button to={Routes.TimeEntries} component={Link}>
              <ListItemIcon>
                <TimerIcon />
              </ListItemIcon>
              <ListItemText primary={<Trans>LeftMenu.TimeEntries</Trans>} />
            </ListItem>
            <ListItem button to={Routes.TimeAbsenceEntries} component={Link}>
              <ListItemIcon>
                <WeekendIcon />
              </ListItemIcon>
              <ListItemText primary={<Trans>LeftMenu.TimeAbsenceEntries</Trans>} />
            </ListItem>
            <ListItem button to={Routes.TimeHolidayEntries} component={Link}>
              <ListItemIcon>
                <BeachAccessIcon />
              </ListItemIcon>
              <ListItemText primary={<Trans>LeftMenu.TimeHolidayEntries</Trans>} />
            </ListItem>
            <Divider />
            <ListItem button to={Routes.BulkInsert} component={Link}>
              <ListItemIcon>
                <FastForwardIcon />
              </ListItemIcon>
              <ListItemText primary={<Trans>LeftMenu.BulkInsert</Trans>} />
            </ListItem>
            <ListItem button to={Routes.Export} component={Link}>
              <ListItemIcon>
                <InsertDriveFileIcon />
              </ListItemIcon>
              <ListItemText primary={<Trans>LeftMenu.Export</Trans>} />
            </ListItem>
          </List>
        </Drawer>

        <div
          className={clsx(classes.content, {
            [classes.contentShift]: isRightDrawerOpen,
          })}
        >
          <main>
            <div className={classes.appBarSpacer} />
            <Container maxWidth="lg" className={classes.container}>
              <Route path={Routes.Dashboard} component={Dashboard} />
              <Route path={Routes.Profile} component={Profile} />
              <Route path={Routes.TimeEntries} component={TimeEntries} />
              <Route path={Routes.TimeAbsenceEntries} component={TimeAbsenceEntries} />
              <Route path={Routes.TimeHolidayEntries} component={TimeHolidayEntries} />
              <Route path={Routes.EditTimeEntry} component={EditTimeEntry} />
              <Route path={Routes.EditTimeAbsenceEntry} component={EditTimeAbsenceEntry} />
              <Route path={Routes.EditTimeHolidayEntry} component={EditTimeHolidayEntry} />
              <Route path={Routes.BulkInsert} component={BulkInsert} />
              <Route path={Routes.Export} component={Export} />
            </Container>
          </main>

          <footer className={classes.footer}>
            <Container maxWidth="lg">
              <Grid container direction="row" justify="space-between" alignItems="center">
                <Grid item>
                  <div className={classes.footerLinks}>
                    <Typography
                      variant="subtitle1"
                      align="center"
                      color="textSecondary"
                      component="p"
                    >
                      From developer for developers with love!
                    </Typography>
                    <a
                      href="https://github.com/lucax88x/kairos"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <IconButton color="inherit" aria-label="Github">
                        <SimpleIcon type="github" className={classes.footerIcon}></SimpleIcon>
                      </IconButton>
                    </a>
                    <a
                      href="https://github.com/lucax88x/kairos/stargazers"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        alt="preview badge"
                        src="https://img.shields.io/github/stars/lucax88x/kairos?style=for-the-badge"
                      ></img>
                    </a>
                    <a
                      href="https://github.com/lucax88x/kairos/issues"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        alt="preview badge"
                        src="https://img.shields.io/github/issues/lucax88x/kairos?style=for-the-badge"
                      ></img>
                    </a>
                  </div>
                </Grid>
                <Grid item>
                  <div className={classes.footerLinks}>
                    <a href="https://lucax88x.github.io" target="_blank" rel="noopener noreferrer">
                      <IconButton color="inherit" aria-label="Github.io">
                        <Avatar
                          className={classes.footerAvatar}
                          alt={'lucatrazzi'}
                          src={'https://lucax88x.github.io/img/author.jpg'}
                        />
                      </IconButton>
                    </a>

                    <a href="https://github.com/lucax88x" target="_blank" rel="noopener noreferrer">
                      <IconButton color="inherit" aria-label="Github">
                        <SimpleIcon type="github" className={classes.footerIcon}></SimpleIcon>
                      </IconButton>
                    </a>
                    <a
                      href="https://www.linkedin.com/in/luca-trazzi-93217931/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <IconButton color="inherit" aria-label="Linkedin">
                        <SimpleIcon type="linkedin" className={classes.footerIcon}></SimpleIcon>
                      </IconButton>
                    </a>
                  </div>
                </Grid>
              </Grid>
            </Container>
          </footer>
        </div>

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
            <ListItem button to={Routes.Profile} component={Link}>
              <ListItemIcon>
                <Avatar
                  alt={user.name}
                  src={user.picture}
                  // className={classes.avatar}
                />
              </ListItemIcon>
              <ListItemText primary={<Trans>TopBar.Profile</Trans>} />
            </ListItem>
            <Divider />
            <ListItem button onClick={handleTimeEntryDrawerOpen}>
              <ListItemIcon>
                <TimerIcon />
              </ListItemIcon>
              <ListItemText primary={<Trans>TopBar.OpenTimeEntry</Trans>} />
            </ListItem>
            <ListItem button onClick={handleTimeAbsenceEntryDrawerOpen}>
              <ListItemIcon>
                <WeekendIcon />
              </ListItemIcon>
              <ListItemText primary={<Trans>TopBar.OpenTimeAbsenceEntry</Trans>} />
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
              <Select
                fullWidth
                value={year}
                onChange={handleYearChange}
                className={classes.topbarSelect}
              >
                {map(
                  year => (
                    <MenuItem key={year} value={year} className={classes.topbarSelectOption}>
                      {year}
                    </MenuItem>
                  ),
                  years,
                )}
              </Select>
            </ListItem>
            <Divider />
            <ListItem button onClick={onLogout}>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary={<Trans>TopBar.Logout</Trans>} />
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
