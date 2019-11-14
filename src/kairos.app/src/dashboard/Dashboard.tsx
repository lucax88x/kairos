import { Grid, makeStyles, Paper, Typography } from '@material-ui/core';
import RefreshIcon from '@material-ui/icons/Refresh';
import React from 'react';
import { TimeEntriesByRange } from './TimeEntriesByRange.container';
import { TimeEntriesCalendar } from './TimeEntriesCalendar.container';
import { TimeStatistics } from './TimeStatistics.container';
import { DashboardHeader } from './DashboardHeader.container';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'grid',
    gridGap: theme.spacing(1),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'grid',
    overflow: 'auto',
    gridAutoFlow: 'row',
  },
}));

export const Dashboard: React.FC = props => {
  const classes = useStyles(props);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <DashboardHeader></DashboardHeader>
      </Paper>
      <Paper className={classes.paper}>
        <TimeStatistics />
      </Paper>
      <Paper className={classes.paper}>
        <TimeEntriesByRange />
      </Paper>
      <Paper className={classes.paper}>
        <TimeEntriesCalendar />
      </Paper>
    </div>
  );
};
