import { Trans, t } from '@lingui/macro';
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
  Menu,
  MenuItem,
  Select,
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
import { Language, Languages } from './models/language-model';
import { UserModel } from './models/user.model';
import { Profile } from './profile/Profile.container';
import { Routes } from './routes';
import { TimeAbsenceEntries } from './time-absence-entries/TimeAbsenceEntries.container';
import { TimeEntries } from './time-entries/TimeEntries.container';
import { TimeHolidayEntries } from './time-holiday-entries/TimeHolidayEntries.container';
import { i18n } from './i18nLoader';

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
  languageSelect: {
    textAlign: 'center',
  },
  languageOption: {
    justifyContent: 'center',
    padding: theme.spacing(1),
  },
  languageOptionFlag: {
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
    display: 'flex',
    flexDirection: 'column',
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
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(0.5),
    marginTop: 'auto',
  },
}));

export interface AppInputs {
  user: UserModel;
  selectedLanguage: Language;
  selectedYear: number;
  isLeftDrawerOpen: boolean;
  isTimeEntryDrawerOpen: boolean;
  isTimeAbsenceEntryDrawerOpen: boolean;
}

export interface AppDispatches {
  onSelectYear: (year: number) => void;
  onSelectLanguage: (language: Language) => void;
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
    selectedLanguage,
    selectedYear,
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
    onSelectYear,
    onSelectLanguage,
  } = props;

  const classes = useStyles(props);

  const handleLeftDrawerOpen = useCallback(() => openLeftDrawer(), [openLeftDrawer]);

  const handleLeftDrawerClose = useCallback(() => closeLeftDrawer(), [closeLeftDrawer]);

  const [userMenuEl, setUserMenuEl] = useState<Element | null>(null);
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

  const handleUserMenuOpen = useCallback(
    (event: React.KeyboardEvent | React.MouseEvent) => setUserMenuEl(event.currentTarget),
    [setUserMenuEl],
  );

  const handleUserMenuClose = useCallback(
    (event: React.KeyboardEvent | React.MouseEvent) => setUserMenuEl(null),
    [setUserMenuEl],
  );

  const handleYearChange = useCallback(
    (event: ChangeEvent<{ value: unknown }>) => {
      if (isNumber(event.target.value)) {
        setYear(event.target.value);
        onSelectYear(event.target.value);
      }
    },
    [setYear],
  );

  const handleLanguageChange = useCallback(
    (event: ChangeEvent<{ value: unknown }>) => {
      if (isLanguage(event.target.value)) {
        setLanguage(event.target.value);
        onSelectLanguage(event.target.value);
      }
    },
    [setYear],
  );

  const getFlag = useCallback(
    (language: Language) => {
      switch (language) {
        case 'it':
          return <ItalianFlag className={classes.languageOptionFlag} />;
        default:
        case 'en':
          return <EnglishFlag className={classes.languageOptionFlag} />;
      }
    },
    [classes],
  );

  return (
    <>
      <div className={classes.root}>
        <AppBar
          position="absolute"
          className={clsx(classes.appBar, isLeftDrawerOpen && classes.appBarShift)}
        >
          <Toolbar className={classes.toolbar}>
            <Grid container>
              <Grid container item alignItems={'center'} justify={'flex-start'} spacing={1} xs={6}>
                <Grid item>
                  <IconButton
                    edge="start"
                    color="inherit"
                    aria-label={i18n._(t`TopBar.OpenMenu`)}
                    onClick={handleLeftDrawerOpen}
                    className={clsx(
                      classes.menuButton,
                      isLeftDrawerOpen && classes.menuButtonHidden,
                    )}
                  >
                    <MenuIcon />
                  </IconButton>
                </Grid>
                <Grid item>
                  <Link to={Routes.Dashboard}>
                    <LogoIcon className={classes.logo} />
                  </Link>
                </Grid>

                <Grid item>
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
                </Grid>
              </Grid>
              <Grid container item alignItems={'center'} justify={'flex-end'} spacing={1} xs={6}>
                <Grid item>
                  <Select
                    value={year}
                    onChange={handleYearChange}
                    inputProps={{
                      id: 'year',
                    }}
                  >
                    {map(
                      year => (
                        <MenuItem key={year} value={year}>
                          {year}
                        </MenuItem>
                      ),
                      years,
                    )}
                  </Select>
                </Grid>
                <Grid item>
                  <IconButton
                    color="inherit"
                    aria-label={i18n._(t`TopBar.OpenTimeAbsenceEntry`)}
                    onClick={handleTimeAbsenceEntryDrawerOpen}
                  >
                    <WeekendIcon />
                  </IconButton>
                </Grid>
                <Grid item>
                  <IconButton
                    color="inherit"
                    aria-label={i18n._(t`TopBar.OpenTimeEntry`)}
                    onClick={handleTimeEntryDrawerOpen}
                  >
                    <TimerIcon />
                  </IconButton>
                </Grid>
                <Grid item>
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
                    <MenuItem onClick={onNavigateToProfile}>
                      <Trans>TopBar.Profile</Trans>
                    </MenuItem>
                    <MenuItem>
                      <Select
                        fullWidth
                        value={language}
                        onChange={handleLanguageChange}
                        className={classes.languageSelect}
                      >
                        {map(
                          language => (
                            <MenuItem
                              key={language}
                              value={language}
                              className={classes.languageOption}
                            >
                              {getFlag(language)}
                            </MenuItem>
                          ),
                          Languages,
                        )}
                      </Select>
                    </MenuItem>
                    <MenuItem onClick={onLogout}>Logout</MenuItem>
                  </Menu>
                </Grid>
              </Grid>
            </Grid>
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
        <div className={classes.content}>
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
            </Container>
          </main>

          <footer className={classes.footer}>
            <Container maxWidth="lg">
              <Grid container direction="row" justify="space-between" alignItems="center">
                <Grid item>
                  <Grid container justify="space-between" alignItems="center">
                    <Typography
                      variant="subtitle1"
                      align="center"
                      color="textSecondary"
                      component="p"
                    >
                      From developer for developers with love!
                    </Typography>
                    <a href="https://github.com/lucax88x/kairos" target="_blank">
                      <IconButton color="inherit" aria-label="Github">
                        <SimpleIcon type="github" className={classes.footerIcon}></SimpleIcon>
                      </IconButton>
                    </a>
                    <a href="https://github.com/lucax88x/kairos/stargazers" target="_blank">
                      <img
                        alt="preview badge"
                        src="https://img.shields.io/github/stars/lucax88x/kairos?style=for-the-badge"
                      ></img>
                    </a>
                  </Grid>
                </Grid>
                <Grid item>
                  <Grid container justify="space-between" alignItems="center">
                    <a href="https://lucax88x.github.io" target="_blank">
                      <IconButton color="inherit" aria-label="Github.io">
                        <Avatar
                          className={classes.footerAvatar}
                          alt={'lucatrazzi'}
                          src={'https://lucax88x.github.io/img/author.jpg'}
                        />
                      </IconButton>
                    </a>

                    <a href="https://github.com/lucax88x" target="_blank">
                      <IconButton color="inherit" aria-label="Github">
                        <SimpleIcon type="github" className={classes.footerIcon}></SimpleIcon>
                      </IconButton>
                    </a>
                    <a href="https://www.linkedin.com/in/luca-trazzi-93217931/" target="_blank">
                      <IconButton color="inherit" aria-label="Linkedin">
                        <SimpleIcon type="linkedin" className={classes.footerIcon}></SimpleIcon>
                      </IconButton>
                    </a>
                  </Grid>
                </Grid>
              </Grid>
            </Container>
          </footer>
        </div>
      </div>
    </>
  );
};
