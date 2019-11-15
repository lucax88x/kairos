import { Grid, makeStyles, Paper } from '@material-ui/core';
import React from 'react';
import Spinner from '../components/Spinner';
import { Language } from '../models/language-model';
import { TimeHolidayEntryModel } from '../models/time-holiday-entry.model';
import { TimeHolidayEntryForm } from '../shared/TimeHolidayEntryForm';

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(2),
    display: 'grid',
    overflow: 'auto',
    gridAutoFlow: 'row',
  },
}));

export interface EditTimeHolidayEntryInputs {
  isOnline: boolean;
  selectedLanguage: Language;
  timeHolidayEntry: TimeHolidayEntryModel;
  isGetBusy: boolean;
  isUpdateBusy: boolean;
}

export interface EditTimeHolidayEntryDispatches {
  onUpdate: (model: TimeHolidayEntryModel) => void;
}

type EditTimeHolidayEntryProps = EditTimeHolidayEntryInputs &
  EditTimeHolidayEntryDispatches;

export const EditTimeHolidayEntryComponent: React.FC<EditTimeHolidayEntryProps> = props => {
  const classes = useStyles(props);

  const {
    isOnline,
    selectedLanguage,
    timeHolidayEntry,
    isGetBusy,
    isUpdateBusy,
    onUpdate,
  } = props;

  return (
    <Grid container spacing={3}>
      <Grid item xs>
        <Paper className={classes.paper}>
          <Spinner show={isGetBusy}>
            <TimeHolidayEntryForm
              isOnline={isOnline}
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
