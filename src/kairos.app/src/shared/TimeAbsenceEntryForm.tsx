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
import SaveIcon from '@material-ui/icons/Save';
import {
  DateTimePicker,
  MaterialUiPickersDate,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { isString } from '../code/is';
import ButtonSpinner from '../components/ButtonSpinner';
import { TimeAbsenceEntryModel, TimeAbsenceEntryTypes, getTransFromType } from '../models/time-absence-entry.model';
import { Trans } from '@lingui/macro';

const useStyles = makeStyles(theme => ({
  hasPadding: {
    padding: theme.spacing(3),
  },
}));

export interface TimeAbsenceEntryFormProps {
  model: TimeAbsenceEntryModel;
  isBusy: boolean;
  onSave: (model: TimeAbsenceEntryModel) => void;
}

export const TimeAbsenceEntryForm: React.FC<TimeAbsenceEntryFormProps> = props => {
  const classes = useStyles(props);

  const { model, isBusy, onSave } = props;

  const [id, setId] = useState(model.id);
  const [type, setType] = useState(model.type);
  const [description, setDescription] = useState<string>(model.description);
  const [start, setStart] = useState<Date | null>(model.start);
  const [end, setEnd] = useState<Date | null>(model.end);

  useEffect(() => {
    if (!model.isEmpty()) {
      setId(model.id);
      setType(model.type);
      setDescription(model.description);
      setStart(model.start);
      setEnd(model.end);
    }
  }, [model]);

  const handleSave = useCallback(() => {
    if (!!start && !!end) {
      onSave(new TimeAbsenceEntryModel(id, description, start, end, type));
    }
  }, [onSave, id, type, description, start, end]);

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
          <InputLabel htmlFor="type">
            <Trans>Label.Type</Trans>
          </InputLabel>
          <Select
            value={type}
            onChange={handleTypeChange}
            inputProps={{
              id: 'type',
            }}
          >
            <MenuItem value={TimeAbsenceEntryTypes.ILLNESS}>
              <Trans>Values.TimeAbsenceEntryTypes.Illness</Trans>
            </MenuItem>
            <MenuItem value={TimeAbsenceEntryTypes.VACATION}>
              <Trans>Values.TimeAbsenceEntryTypes.Vacation</Trans>
            </MenuItem>
            <MenuItem value={TimeAbsenceEntryTypes.PERMIT}>
              <Trans>Values.TimeAbsenceEntryTypes.Permit</Trans>
            </MenuItem>
            <MenuItem value={TimeAbsenceEntryTypes.COMPENSATION}>
              <Trans>Values.TimeAbsenceEntryTypes.Compensation</Trans>
            </MenuItem>
          </Select>
        </FormControl>
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
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <Grid item xs={12}>
            <DateTimePicker
              autoOk
              ampm={false}
              value={start}
              maxDate={end}
              onChange={handleStartChange}
              label={<Trans>Labels.Start</Trans>}
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
              label={<Trans>Labels.End</Trans>}
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
          {model.isEmpty() ? getTransFromType(type) : <SaveIcon />}
        </ButtonSpinner>
      </Grid>
    </Grid>
  );
};
