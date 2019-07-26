import { Grid, makeStyles, Paper } from '@material-ui/core';
import React, { useCallback } from 'react';

import Spinner from '../components/Spinner';
import { TimeEntryModel } from '../models/time-entry.model';
import { TimeEntryForm } from '../shared/TimeEntryForm';

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(2),
    display: 'grid',
    overflow: 'auto',
    gridAutoFlow: 'row',
  },
}));

export interface EditTimeEntryInputs {
  timeEntry: TimeEntryModel;
  isGetBusy: boolean;
  isUpdateBusy: boolean;
}

export interface EditTimeEntryDispatches {
  update: (model: TimeEntryModel) => void;
}

type EditTimeEntryProps = EditTimeEntryInputs & EditTimeEntryDispatches;

export const EditTimeEntryComponent: React.FC<EditTimeEntryProps> = props => {
  const classes = useStyles(props);

  const { timeEntry, isGetBusy, isUpdateBusy, update } = props;

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper className={classes.paper}>
          <Spinner show={isGetBusy}>
            <TimeEntryForm isBusy={isUpdateBusy} model={timeEntry} save={update} />
          </Spinner>
        </Paper>
      </Grid>
    </Grid>
  );
};
