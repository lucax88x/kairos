import { Grid, makeStyles, Paper } from '@material-ui/core';
import React from 'react';
import Spinner from '../components/Spinner';
import { Language } from '../models/language-model';
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
  isOnline: boolean;
  selectedLanguage: Language;
  timeAbsenceEntry: TimeAbsenceEntryModel;
  isGetBusy: boolean;
  isUpdateBusy: boolean;
}

export interface EditTimeAbsenceEntryDispatches {
  onUpdate: (model: TimeAbsenceEntryModel) => void;
}

type EditTimeAbsenceEntryProps = EditTimeAbsenceEntryInputs &
  EditTimeAbsenceEntryDispatches;

export const EditTimeAbsenceEntryComponent: React.FC<EditTimeAbsenceEntryProps> = props => {
  const classes = useStyles(props);

  const {
    isOnline,
    selectedLanguage,
    timeAbsenceEntry,
    isGetBusy,
    isUpdateBusy,
    onUpdate,
  } = props;

  return (
    <Grid container spacing={3}>
      <Grid item xs>
        <Paper className={classes.paper}>
          <Spinner show={isGetBusy}>
            <TimeAbsenceEntryForm
              isOnline={isOnline}
              selectedLanguage={selectedLanguage}
              isBusy={isUpdateBusy}
              model={timeAbsenceEntry}
              onSave={onUpdate}
            />
          </Spinner>
        </Paper>
      </Grid>
    </Grid>
  );
};
