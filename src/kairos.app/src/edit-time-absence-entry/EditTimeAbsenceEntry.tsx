import { Grid, makeStyles, Paper } from '@material-ui/core';
import React, { useCallback } from 'react';

import Spinner from '../components/Spinner';
import { TimeAbsenceEntryModel } from '../models/time-absence-entry.model';
import { TimeAbsenceEntryForm } from '../shared/TimeAbsenceEntryForm';

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(2),
    display: 'grid',
    overflow: 'auto',
    gridAutoFlow: 'row',
  },
}));

export interface EditTimeAbsenceEntryInputs {
  timeAbsenceEntry: TimeAbsenceEntryModel;
  isGetBusy: boolean;
  isUpdateBusy: boolean;
}

export interface EditTimeAbsenceEntryDispatches {
  update: (model: TimeAbsenceEntryModel) => void;
}

type EditTimeAbsenceEntryProps = EditTimeAbsenceEntryInputs & EditTimeAbsenceEntryDispatches;

export const EditTimeAbsenceEntryComponent: React.FC<EditTimeAbsenceEntryProps> = props => {
  const classes = useStyles(props);

  const { timeAbsenceEntry, isGetBusy, isUpdateBusy, update } = props;

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper className={classes.paper}>
          <Spinner show={isGetBusy}>
            <TimeAbsenceEntryForm isBusy={isUpdateBusy} model={timeAbsenceEntry} save={update} />
          </Spinner>
        </Paper>
      </Grid>
    </Grid>
  );
};
