import { Grid, makeStyles, Paper } from '@material-ui/core';
import React from 'react';
import { TimeEntriesByRange } from './TimeEntriesByRange.container';
import { TimeEntriesCalendar } from './TimeEntriesCalendar.container';


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
      {/* <Grid item xs>
        <Paper className={classes.paper}>
          <TimeStatistics />
        </Paper>
      </Grid> */}
      <Grid item xs>
        <Paper className={classes.paper}>
          <TimeEntriesByRange />
        </Paper>
      </Grid>
      <Grid item xs>
        <Paper className={classes.paper}>
          <TimeEntriesCalendar />
        </Paper>
      </Grid>
    </Grid>
  );
};
