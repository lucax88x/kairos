import { Grid, makeStyles, Paper } from '@material-ui/core';
import React, { useCallback } from 'react';

import Spinner from '../components/Spinner';
import { ProfileModel } from '../models/profile.model';
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
  profile: ProfileModel;
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

  const { profile, timeEntry, isGetBusy, isUpdateBusy, update } = props;

  return (
    <Grid container spacing={3}>
      <Grid item xs>
        <Paper className={classes.paper}>
          <Spinner show={isGetBusy}>
            <TimeEntryForm
              profile={profile}
              isBusy={isUpdateBusy}
              model={timeEntry}
              onSave={update}
            />
          </Spinner>
        </Paper>
      </Grid>
    </Grid>
  );
};
