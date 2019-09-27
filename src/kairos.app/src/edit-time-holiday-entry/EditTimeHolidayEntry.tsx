import { Grid, makeStyles, Paper } from '@material-ui/core';
import React, { useCallback } from 'react';

import Spinner from '../components/Spinner';
import { TimeHolidayEntryModel } from '../models/time-holiday-entry.model';
import { TimeHolidayEntryForm } from '../shared/TimeHolidayEntryForm';
import { Language } from '../models/language-model';

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(2),
    display: 'grid',
    overflow: 'auto',
    gridAutoFlow: 'row',
  },
}));

export interface EditTimeHolidayEntryInputs {
  selectedLanguage: Language;
  timeHolidayEntry: TimeHolidayEntryModel;
  isGetBusy: boolean;
  isUpdateBusy: boolean;
}

export interface EditTimeHolidayEntryDispatches {
  onUpdate: (model: TimeHolidayEntryModel) => void;
}

type EditTimeHolidayEntryProps = EditTimeHolidayEntryInputs & EditTimeHolidayEntryDispatches;

export const EditTimeHolidayEntryComponent: React.FC<EditTimeHolidayEntryProps> = props => {
  const classes = useStyles(props);

  const { selectedLanguage, timeHolidayEntry, isGetBusy, isUpdateBusy, onUpdate } = props;

  return (
    <Grid container spacing={3}>
      <Grid item xs>
        <Paper className={classes.paper}>
          <Spinner show={isGetBusy}>
            <TimeHolidayEntryForm
              selectedLanguage={selectedLanguage}
              isBusy={isUpdateBusy}
              model={timeHolidayEntry}
              onSave={onUpdate}
            />
          </Spinner>
        </Paper>
      </Grid>
    </Grid>
  );
};
