import { Grid, makeStyles, Paper } from '@material-ui/core';
import React from 'react';
import Spinner from '../components/Spinner';
import { Language } from '../models/language-model';
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
  selectedLanguage: Language;
  profile: ProfileModel;
  timeEntry: TimeEntryModel;
  isGetBusy: boolean;
  isUpdateBusy: boolean;
}

export interface EditTimeEntryDispatches {
  onUpdate: (model: TimeEntryModel) => void;
}

type EditTimeEntryProps = EditTimeEntryInputs & EditTimeEntryDispatches;

export const EditTimeEntryComponent: React.FC<EditTimeEntryProps> = props => {
  const classes = useStyles(props);

  const { selectedLanguage, profile, timeEntry, isGetBusy, isUpdateBusy, onUpdate } = props;

  return (
    <Grid container spacing={3}>
      <Grid item xs>
        <Paper className={classes.paper}>
          <Spinner show={isGetBusy}>
            <TimeEntryForm
              selectedLanguage={selectedLanguage}
              profile={profile}
              isBusy={isUpdateBusy}
              model={timeEntry}
              onSave={onUpdate}
            />
          </Spinner>
        </Paper>
      </Grid>
    </Grid>
  );
};
