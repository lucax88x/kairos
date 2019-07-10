import { Grid, Paper } from '@material-ui/core';
import React from 'react';

import { TimeEntries } from './TimeEntries';

export const Dashboard: React.FC = props => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={12} lg={12}>
        <Paper>
          <TimeEntries />
        </Paper>
      </Grid>
    </Grid>
  );
};
