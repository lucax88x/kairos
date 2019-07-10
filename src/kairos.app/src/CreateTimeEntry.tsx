import DateFnsUtils from '@date-io/date-fns';
import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
} from '@material-ui/core';
import {
  KeyboardDatePicker,
  KeyboardTimePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import React, { useCallback, useState } from 'react';

import { TimeEntryTypes } from './models/time-entry.model';

export interface CreateTimeEntryDispatches {
  createTimeEntry: () => void;
}

export const CreateTimeEntryComponent: React.FC<CreateTimeEntryDispatches> = ({
  createTimeEntry,
}) => {
  const [date, setDate] = useState();
  const [time, setTime] = useState();

  const onCreateTimeEntry = useCallback(() => createTimeEntry(), [createTimeEntry]);

  return (
    <Grid>
      <Grid>
        <FormControl component="fieldset">
          <FormLabel component="legend">In / Out</FormLabel>
          <RadioGroup aria-label="timeEntryType" name="timeEntryType" row>
            <FormControlLabel value={TimeEntryTypes.IN} control={<Radio />} label="In" />
            <FormControlLabel value={TimeEntryTypes.OUT} control={<Radio />} label="Out" />
          </RadioGroup>
        </FormControl>
      </Grid>
      <Grid container justify="space-around">
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker
            margin="normal"
            label="Date"
            value={date}
            onChange={setDate}
            KeyboardButtonProps={{
              'aria-label': 'change date',
            }}
          />
          <KeyboardTimePicker
            margin="normal"
            label="Time"
            value={time}
            onChange={setTime}
            KeyboardButtonProps={{
              'aria-label': 'change time',
            }}
          />
        </MuiPickersUtilsProvider>
      </Grid>
      <Button variant="contained" onClick={onCreateTimeEntry}>
        Confirm
      </Button>
    </Grid>
  );
};
