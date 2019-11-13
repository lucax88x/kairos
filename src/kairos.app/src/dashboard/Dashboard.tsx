import { Grid, makeStyles, Paper } from '@material-ui/core';
import React from 'react';
import { TimeEntriesByRange } from './TimeEntriesByRange.container';
import { TimeEntriesCalendar } from './TimeEntriesCalendar.container';
import { TimeStatistics } from './TimeStatistics.container';

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
