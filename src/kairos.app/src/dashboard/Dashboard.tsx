import { Grid, makeStyles, Paper } from '@material-ui/core';
import React from 'react';

import { TimeAbsenceEntries } from './TimeAbsenceEntries.container';
import { TimeEntries } from './TimeEntries.container';
import { TimeEntriesByRange } from './TimeEntriesByRange.container';

const useStyles = makeStyles(theme => ({
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
    <Grid container spacing={3}>
      <Grid item xs={6}>
        <Paper className={classes.paper}>
          <TimeEntries />
        </Paper>
      </Grid>
      <Grid item xs={6}>
        <Paper className={classes.paper}>
          <TimeAbsenceEntries />
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Paper className={classes.paper}>
          <TimeEntriesByRange />
        </Paper>
      </Grid>
    </Grid>
  );
};
