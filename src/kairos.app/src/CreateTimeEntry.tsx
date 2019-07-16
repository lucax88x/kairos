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
import React, { useCallback, useState } from 'react';

import { mergeDateAndTime } from './code/mergeDateAndTime';
import ButtonSpinner from './components/ButtonSpinner';
import { TimeEntryTypes } from './models/time-entry.model';

const useStyles = makeStyles(theme => ({
  hasPadding: {
    padding: theme.spacing(3),
  },
}));

export interface CreateTimeEntryInputs {
  isBusy: boolean;
}

export interface CreateTimeEntryDispatches {
  createTimeEntry: (type: TimeEntryTypes, when: Date) => void;
}

type CreateTimeEntryProps = CreateTimeEntryInputs & CreateTimeEntryDispatches;

export const CreateTimeEntryComponent: React.FC<CreateTimeEntryProps> = props => {
  const classes = useStyles(props);

  const { createTimeEntry, isBusy } = props;

  const [type, setType] = useState(TimeEntryTypes.IN);
  const [date, setDate] = useState<Date | null>(new Date());
  const [time, setTime] = useState<Date | null>(new Date());

  const handleCreateTimeEntry = useCallback(() => {
    if (!!date && !!time) {
      createTimeEntry(type, mergeDateAndTime(date, time));
    }
  }, [createTimeEntry, type, date, time]);
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
        <ButtonSpinner
          onClick={handleCreateTimeEntry}
          isBusy={isBusy}
          disabled={!date || !time || isBusy}
        >
          {type}
        </ButtonSpinner>
      </Grid>
    </Grid>
  );
};
