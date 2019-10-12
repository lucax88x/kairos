import DateFnsUtils from '@date-io/date-fns';
import { Trans } from '@lingui/react';
import { Divider, makeStyles, TextField } from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import {
  KeyboardDateTimePicker,
  MaterialUiPickersDate,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { getDatepickerLocale } from '../code/get-datepicker-locale';
import ButtonSpinner from '../components/ButtonSpinner';
import { Language } from '../models/language-model';
import { TimeHolidayEntryModel } from '../models/time-holiday-entry.model';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'grid',
    padding: theme.spacing(3),
    gridGap: theme.spacing(1),
  },
  selfCenter: {
    justifySelf: 'center',
  },
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
    <div className={classes.container}>
      <TextField
        autoFocus
        margin="dense"
        id="description"
        label={<Trans>Labels.Description</Trans>}
        type="text"
        value={description}
        onChange={handleDescriptionChange}
        fullWidth
      />
      <MuiPickersUtilsProvider utils={DateFnsUtils} locale={getDatepickerLocale(selectedLanguage)}>
        <KeyboardDateTimePicker
          autoOk
          ampm={false}
          value={when}
          onChange={handleWhenChange}
          label={<Trans>Labels.When</Trans>}
          fullWidth
        />
      </MuiPickersUtilsProvider>
      <Divider />
      <ButtonSpinner
        onClick={handleSave}
        isBusy={isBusy}
        disabled={!when || isBusy}
        className={classes.selfCenter}
      >
        <SaveIcon />
      </ButtonSpinner>
    </div>
  );
};
