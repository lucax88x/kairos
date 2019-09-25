import { Tab, Tabs, makeStyles, Paper } from '@material-ui/core';
import BeachAccessIcon from '@material-ui/icons/BeachAccess';
import TimerIcon from '@material-ui/icons/Timer';
import WeekendIcon from '@material-ui/icons/Weekend';
import React, { useCallback, useState } from 'react';
import { BulkTimeAbsenceEntryInsert } from './BulkTimeAbsenceEntryInsert.container';
import { BulkTimeEntryInsert } from './BulkTimeEntryInsert.container';
import { BulkTimeHolidayEntryInsert } from './BulkTimeHolidayEntryInsert.container';
import { i18n } from '../i18nLoader';
import { t } from '@lingui/macro';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
  },
  tabContent: {
    padding: theme.spacing(1),
  },
}));

export const BulkInsert: React.FC = props => {
  const classes = useStyles(props);

  const [tab, setTab] = useState(0);
  const handleChangeTab = useCallback(
    (event: React.ChangeEvent<{}>, newTab: number) => setTab(newTab),
    [setTab],
  );
  return (
    <div className={classes.root}>
      <Tabs value={tab} onChange={handleChangeTab} centered>
        <Tab label={i18n._(t`BulkInsert.TimeEntryTabHeader`)} icon={<TimerIcon />} />
        <Tab label={i18n._(t`BulkInsert.TimeAbsenceEntryTabHeader`)} icon={<WeekendIcon />} />
        <Tab label={i18n._(t`BulkInsert.TimeHolidayEntryTabHeader`)} icon={<BeachAccessIcon />} />
      </Tabs>
      <div className={classes.tabContent}>
        {tab === 0 && <BulkTimeEntryInsert />}
        {tab === 1 && <BulkTimeAbsenceEntryInsert />}
        {tab === 2 && <BulkTimeHolidayEntryInsert />}
      </div>
    </div>
  );
};
