import { Grid, Paper, makeStyles } from '@material-ui/core';
import React from 'react';

import { TimeEntries } from './TimeEntries.container';

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
      <Grid item xs={12} md={12} lg={12}>
        <Paper className={classes.paper}>
          <TimeEntries />
        </Paper>
      </Grid>
    </Grid>
  );
};
