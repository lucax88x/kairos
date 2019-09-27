import DateFnsUtils from '@date-io/date-fns';
import { Divider, Grid, makeStyles, TextField } from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import {
  DateTimePicker,
  MaterialUiPickersDate,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { getDatepickerLocale } from '../code/get-datepicker-locale';
import ButtonSpinner from '../components/ButtonSpinner';
import { Language } from '../models/language-model';
import { TimeHolidayEntryModel } from '../models/time-holiday-entry.model';

const useStyles = makeStyles(theme => ({
  hasPadding: {
    padding: theme.spacing(3),
  },
}));

export interface TimeHolidayEntryFormProps {
  selectedLanguage: Language;
  model: TimeHolidayEntryModel;
  isBusy: boolean;
  onSave: (model: TimeHolidayEntryModel) => void;
}

export const TimeHolidayEntryForm: React.FC<TimeHolidayEntryFormProps> = props => {
  const classes = useStyles(props);

  const { selectedLanguage, model, isBusy, onSave } = props;

  const [id, setId] = useState(model.id);
  const [description, setDescription] = useState<string>(model.description);
  const [when, setWhen] = useState<Date | null>(model.when);

  useEffect(() => {
    if (!model.isEmpty()) {
      setId(model.id);
      setDescription(model.description);
      setWhen(model.when);
    }
  }, [model]);

  const handleSave = useCallback(() => {
    if (!!when) {
      onSave(new TimeHolidayEntryModel(id, description, when));
    }
  }, [onSave, id, description, when]);

  const handleDescriptionChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => setDescription(event.currentTarget.value),
    [setDescription],
  );

  const handleWhenChange = useCallback((date: MaterialUiPickersDate) => setWhen(date), [setWhen]);

  return (
    <Grid container direction="column">
      <Grid
        className={classes.hasPadding}
        container
        direction="column"
        justify="center"
        alignItems="center"
      >
        <TextField
          autoFocus
          margin="dense"
          id="description"
          label="Description"
          type="text"
          value={description}
          onChange={handleDescriptionChange}
          fullWidth
        />
        <MuiPickersUtilsProvider
          utils={DateFnsUtils}
          locale={getDatepickerLocale(selectedLanguage)}
        >
          <Grid item xs={12}>
            <DateTimePicker
              autoOk
              ampm={false}
              value={when}
              onChange={handleWhenChange}
              label="Start"
              fullWidth
            />
          </Grid>
        </MuiPickersUtilsProvider>
      </Grid>
      <Divider />
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="center"
        className={classes.hasPadding}
      >
        <ButtonSpinner onClick={handleSave} isBusy={isBusy} disabled={!when || isBusy}>
          <SaveIcon />
        </ButtonSpinner>
      </Grid>
    </Grid>
  );
};
