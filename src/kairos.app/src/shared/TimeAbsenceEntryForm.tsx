import DateFnsUtils from '@date-io/date-fns';
import {
  Divider,
  FormControl,
  Grid,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
  TextField,
} from '@material-ui/core';
import {
  DateTimePicker,
  MaterialUiPickersDate,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { isString } from '../code/is';
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
  const [description, setDescription] = useState<string>(model.description);
  const [start, setStart] = useState<Date | null>(model.start);
  const [end, setEnd] = useState<Date | null>(model.end);

  useEffect(() => {
    console.log('nooh');
    setType(model.type);
    setStart(model.start);
    setEnd(model.end);
  }, [model]);

  const handleSave = useCallback(() => {
    if (!!start && !!end) {
      save(new TimeAbsenceEntryModel(UUID.Generate(), description, start, end, type));
    }
  }, [save, type, description, start, end]);

  const handleTypeChange = useCallback(
    (event: ChangeEvent<{ value: unknown }>) => {
      if (isString(event.target.value)) {
        setType(event.target.value as TimeAbsenceEntryTypes);
      }
    },
    [setType],
  );

  const handleDescriptionChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => setDescription(event.currentTarget.value),
    [setDescription],
  );
  const handleStartChange = useCallback((date: MaterialUiPickersDate) => setStart(date), [
    setStart,
  ]);
  const handleEndChange = useCallback((date: MaterialUiPickersDate) => setEnd(date), [setEnd]);

  return (
    <Grid container direction="column">
      <Grid
        className={classes.hasPadding}
        container
        direction="column"
        justify="center"
        alignItems="center"
      >
        <FormControl fullWidth>
          <InputLabel htmlFor="type">Type</InputLabel>
          <Select
            value={type}
            onChange={handleTypeChange}
            inputProps={{
              id: 'type',
            }}
          >
            <MenuItem value={TimeAbsenceEntryTypes.ILLNESS}>Illness</MenuItem>
            <MenuItem value={TimeAbsenceEntryTypes.VACATION}>Vacation</MenuItem>
            <MenuItem value={TimeAbsenceEntryTypes.PERMIT}>Permit</MenuItem>
            <MenuItem value={TimeAbsenceEntryTypes.COMPENSATION}>Compensation</MenuItem>
          </Select>
        </FormControl>
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
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <Grid item xs={12}>
            <DateTimePicker
              autoOk
              ampm={false}
              value={start}
              maxDate={end}
              onChange={handleStartChange}
              label="Start"
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <DateTimePicker
              autoOk
              ampm={false}
              value={end}
              minDate={start}
              onChange={handleEndChange}
              label="End"
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
        <ButtonSpinner
          onClick={handleSave}
          isBusy={isBusy}
          disabled={!start || !end || start > end || isBusy}
        >
          {type}
        </ButtonSpinner>
      </Grid>
    </Grid>
  );
};
