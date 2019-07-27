import { Grid, makeStyles, Paper } from '@material-ui/core';
import React from 'react';

import { TimeEntriesByRange } from '../time-entries/TimeEntriesByRange.container';

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
      <Grid item xs>
        <Paper className={classes.paper}>
          <TimeEntriesByRange />
        </Paper>
      </Grid>
    </Grid>
  );
};
