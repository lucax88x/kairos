import DateFnsUtils from '@date-io/date-fns';
import {
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  makeStyles,
  Radio,
  RadioGroup,
} from '@material-ui/core';
import {
  KeyboardDatePicker,
  KeyboardTimePicker,
  MaterialUiPickersDate,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import React, { useCallback, useEffect, useState } from 'react';

import { mergeDateAndTime } from '../code/mergeDateAndTime';
import FabButtonSpinner from '../components/FabButtonSpinner';
import { TimeEntryModel, TimeEntryTypes } from '../models/time-entry.model';
import { UUID } from '../models/uuid.model';

const useStyles = makeStyles(theme => ({
  hasPadding: {
    padding: theme.spacing(3),
  },
}));

export interface TimeEntryFormProps {
  model: TimeEntryModel;
  isBusy: boolean;
  save: (model: TimeEntryModel) => void;
}

export const TimeEntryForm: React.FC<TimeEntryFormProps> = props => {
  const classes = useStyles(props);

  const { model, isBusy, save } = props;

  const [type, setType] = useState(model.type);
  const [date, setDate] = useState<Date | null>(model.when);
  const [time, setTime] = useState<Date | null>(model.when);

  useEffect(() => {
    setType(model.type);
    setDate(model.when);
    setTime(model.when);
  }, [model]);

  const handleSave = useCallback(() => {
    if (!!date && !!time) {
      save(new TimeEntryModel(UUID.Generate(), mergeDateAndTime(date, time), type));
    }
  }, [save, type, date, time]);
  const handleTypeChange = useCallback((_, value: string) => setType(value as TimeEntryTypes), [
    setType,
  ]);
  const handleDateChange = useCallback((date: MaterialUiPickersDate) => setDate(date), [setDate]);
  const handleTimeChange = useCallback((date: MaterialUiPickersDate) => setTime(date), [setTime]);

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
            <FormControlLabel value={TimeEntryTypes.IN} control={<Radio />} label="In" />
            <FormControlLabel value={TimeEntryTypes.OUT} control={<Radio />} label="Out" />
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
          <KeyboardTimePicker
            margin="normal"
            value={time}
            ampm={false}
            onChange={handleTimeChange}
            KeyboardButtonProps={{
              'aria-label': 'change time',
            }}
          />
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
        <FabButtonSpinner onClick={handleSave} isBusy={isBusy} disabled={!date || !time || isBusy}>
          {type}
        </FabButtonSpinner>
      </Grid>
    </Grid>
  );
};
