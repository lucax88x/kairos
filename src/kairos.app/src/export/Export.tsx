import { t } from '@lingui/macro';
import { makeStyles, Paper, Tab, Tabs } from '@material-ui/core';
import TimerIcon from '@material-ui/icons/Timer';
import WeekendIcon from '@material-ui/icons/Weekend';
import React, { useCallback, useState } from 'react';
import { connect } from 'react-redux';
import { YouNeedAtLeastOneJob } from '../components/YouNeedAtLeastOneJob';
import { i18n } from '../i18nLoader';
import { ProfileModel } from '../models/profile.model';
import { selectProfile } from '../profile/selectors';
import { State } from '../state';
import { ExportTimeAbsenceEntries } from './ExportTimeAbsenceEntries.container';
import { ExportTimeEntries } from './ExportTimeEntries.container';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
  },
  tabContent: {
    padding: theme.spacing(1),
  },
  paper: {
    padding: theme.spacing(1),
  },
}));

interface ExportInputs {
  profile: ProfileModel;
}

export const ExportComponent: React.FC<ExportInputs> = props => {
  const classes = useStyles(props);
  const { profile } = props;

  const [tab, setTab] = useState(0);
  const handleChangeTab = useCallback(
    (event: React.ChangeEvent<{}>, newTab: number) => setTab(newTab),
    [setTab],
  );

  if (profile.jobs.length === 0) {
    return (
      <Paper className={classes.paper}>
        <YouNeedAtLeastOneJob />
      </Paper>
    );
  }

  return (
    <div className={classes.root}>
      <Tabs value={tab} onChange={handleChangeTab} centered>
        <Tab label={i18n._(t`Export.TimeEntryTabHeader`)} icon={<TimerIcon />} />
        <Tab label={i18n._(t`Export.TimeAbsenceEntryTabHeader`)} icon={<WeekendIcon />} />
      </Tabs>
      <div className={classes.tabContent}>
        {tab === 0 && <ExportTimeEntries />}
        {tab === 1 && <ExportTimeAbsenceEntries />}
      </div>
    </div>
  );
};

const mapStateToProps = (state: State): ExportInputs => ({
  profile: selectProfile(state),
});

export const Export = connect(mapStateToProps)(ExportComponent);
