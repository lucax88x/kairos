import DateFnsUtils from '@date-io/date-fns';
import {
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  Input,
  InputAdornment,
  makeStyles,
  Radio,
  RadioGroup,
} from '@material-ui/core';
import {
  KeyboardDatePicker,
  MaterialUiPickersDate,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';

import ButtonSpinner from '../components/ButtonSpinner';
import { TimeAbsenceEntryModel, TimeAbsenceEntryTypes } from '../models/time-absence-entry.model';
import { UUID } from '../models/uuid.model';

const useStyles = makeStyles(theme => ({
  hasPadding: {
    padding: theme.spacing(3),
  },
}));

export interface TimeAbsenceEntryFormProps {
  model: TimeAbsenceEntryModel;
  isBusy: boolean;
  save: (model: TimeAbsenceEntryModel) => void;
}

export const TimeAbsenceEntryForm: React.FC<TimeAbsenceEntryFormProps> = props => {
  const classes = useStyles(props);

  const { model, isBusy, save } = props;

  const [type, setType] = useState(model.type);
  const [date, setDate] = useState<Date | null>(model.when);

  console.error('divide');
  const [hours, setHours] = useState<number>(model.minutes);
  const [minutes, setMinutes] = useState<number>(model.minutes);

  useEffect(() => {
    setType(model.type);
    setDate(model.when);
    setHours(model.minutes);
    setMinutes(model.minutes);
  }, [model]);

  const handleSave = useCallback(() => {
    if (!!date && !!minutes) {
      save(new TimeAbsenceEntryModel(UUID.Generate(), date, minutes, type));
    }
  }, [save, type, date, minutes]);

  const handleTypeChange = useCallback(
    (_, value: string) => setType(value as TimeAbsenceEntryTypes),
    [setType],
  );

  const handleDateChange = useCallback((date: MaterialUiPickersDate) => setDate(date), [setDate]);
  const handleHoursChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => setHours(event.currentTarget.valueAsNumber),
    [setHours],
  );
  const handleMinutesChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => setMinutes(event.currentTarget.valueAsNumber),
    [setMinutes],
  );

  return (
    <Grid container direction="column">
      <Grid
        className={classes.hasPadding}
        container
        direction="column"
        justify="center"
        alignItems="center"
      >
        <FormControl component="fieldset">
          <RadioGroup
            aria-label="timeEntryType"
            name="timeEntryType"
            row
            value={type}
            onChange={handleTypeChange}
          >
            <FormControlLabel
              value={TimeAbsenceEntryTypes.VACATION}
              control={<Radio />}
              label="Vacation"
            />
            <FormControlLabel
              value={TimeAbsenceEntryTypes.ILLNESS}
              control={<Radio />}
              label="Illness"
            />
          </RadioGroup>
        </FormControl>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            margin="normal"
            value={date}
            onChange={handleDateChange}
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
          />
        </MuiPickersUtilsProvider>
        <Grid
          container
          direction="row"
          // justify="center"
          // alignItems="center"
        >
          <Grid item xs={6}>
            <Input
              placeholder="Hours"
              type="number"
              value={hours}
              endAdornment={<InputAdornment position="end">hrs</InputAdornment>}
              onChange={handleHoursChange}
            />
          </Grid>
          <Grid item xs={6}>
            <Input
              placeholder="Minutes"
              type="number"
              value={minutes}
              onChange={handleMinutesChange}
              endAdornment={<InputAdornment position="end">mins</InputAdornment>}
            />
          </Grid>
        </Grid>
      </Grid>
      <Divider />
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="center"
        className={classes.hasPadding}
      >
        <ButtonSpinner onClick={handleSave} isBusy={isBusy} disabled={!date || !minutes || isBusy}>
          {type}
        </ButtonSpinner>
      </Grid>
    </Grid>
  );
};
