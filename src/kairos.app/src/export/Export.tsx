import { t } from '@lingui/macro';
import { makeStyles, Tab, Tabs } from '@material-ui/core';
import TimerIcon from '@material-ui/icons/Timer';
import WeekendIcon from '@material-ui/icons/Weekend';
import React, { useCallback, useState } from 'react';
import { i18n } from '../i18nLoader';
import { ExportTimeAbsenceEntries } from './ExportTimeAbsenceEntries.container';
import { ExportTimeEntries } from './ExportTimeEntries.container';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
  },
  tabContent: {
    padding: theme.spacing(1),
  },
}));

export const Export: React.FC = props => {
  const classes = useStyles(props);

  const [tab, setTab] = useState(0);
  const handleChangeTab = useCallback(
    (event: React.ChangeEvent<{}>, newTab: number) => setTab(newTab),
    [setTab],
  );
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
