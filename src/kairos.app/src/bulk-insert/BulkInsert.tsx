import { t } from '@lingui/macro';
import { makeStyles, Tab, Tabs, Paper } from '@material-ui/core';
import BeachAccessIcon from '@material-ui/icons/BeachAccess';
import TimerIcon from '@material-ui/icons/Timer';
import WeekendIcon from '@material-ui/icons/Weekend';
import React, { useCallback, useState } from 'react';
import { i18n } from '../i18nLoader';
import { BulkTimeAbsenceEntryInsert } from './BulkTimeAbsenceEntryInsert.container';
import { BulkTimeEntryInsert } from './BulkTimeEntryInsert.container';
import { BulkTimeHolidayEntryInsert } from './BulkTimeHolidayEntryInsert.container';
import { connect } from 'react-redux';
import { State } from '../state';
import { selectProfile } from '../profile/selectors';
import { ProfileModel } from '../models/profile.model';
import { YouNeedAtLeastOneJob } from '../components/YouNeedAtLeastOneJob';

const useStyles = makeStyles(theme => ({
  tabContent: {
    padding: theme.spacing(1),
  },
  paper: {
    padding: theme.spacing(1),
  },
}));

interface BulkInsertInputs {
  profile: ProfileModel;
}

const BulkInsertComponent: React.FC<BulkInsertInputs> = props => {
  const classes = useStyles(props);
  const { profile } = props;

  const [tab, setTab] = useState(0);
  const handleChangeTab = useCallback(
    (_, newTab: number) => setTab(newTab),
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
    <>
      <Tabs value={tab} onChange={handleChangeTab} centered>
        <Tab label={i18n._(t`Time Entries`)} icon={<TimerIcon />} />
        <Tab label={i18n._(t`Absences`)} icon={<WeekendIcon />} />
        <Tab label={i18n._(t`Holidays`)} icon={<BeachAccessIcon />} />
      </Tabs>
      <div className={classes.tabContent}>
        {tab === 0 && <BulkTimeEntryInsert />}
        {tab === 1 && <BulkTimeAbsenceEntryInsert />}
        {tab === 2 && <BulkTimeHolidayEntryInsert />}
      </div>
    </>
  );
};

const mapStateToProps = (state: State): BulkInsertInputs => ({
  profile: selectProfile(state),
});

export const BulkInsert = connect(mapStateToProps)(BulkInsertComponent);
