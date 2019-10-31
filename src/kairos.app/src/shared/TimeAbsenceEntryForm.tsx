import DateFnsUtils from '@date-io/date-fns';
import { Trans } from '@lingui/macro';
import {
  Divider,
  FormControl,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
  TextField,
} from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import {
  KeyboardDateTimePicker,
  MaterialUiPickersDate,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import React, { ChangeEvent, useCallback, useEffect } from 'react';
import { getDatepickerLocale } from '../code/get-datepicker-locale';
import { isString } from '../code/is';
import ButtonSpinner from '../components/ButtonSpinner';
import { Language } from '../models/language-model';
import {
  getTransFromAbsenceType,
  TimeAbsenceEntryModel,
  TimeAbsenceEntryTypes,
} from '../models/time-absence-entry.model';
import {
  SetModel,
  SetTimeAbsenceEntryDescriptionAction,
  SetTimeAbsenceEntryEndAction,
  SetTimeAbsenceEntryStartAction,
  SetTimeAbsenceEntryTypeAction,
  useTimeAbsenceEntryFormReducer,
} from './TimeAbsenceEntryForm.store';

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
  marginLeft: {
    marginLeft: theme.spacing(1),
  },
}));

export interface TimeAbsenceEntryFormProps {
  selectedLanguage: Language;
  model: TimeAbsenceEntryModel;
  isBusy: boolean;
  onSave: (model: TimeAbsenceEntryModel) => void;
}

export const TimeAbsenceEntryForm: React.FC<TimeAbsenceEntryFormProps> = props => {
  const classes = useStyles(props);

  const { selectedLanguage, isBusy, model, onSave } = props;

  const [state, dispatch] = useTimeAbsenceEntryFormReducer();
  const { id, type, description, start, end } = state;

  const handleSave = useCallback(() => {
    if (!!start && !!end) {
      onSave(new TimeAbsenceEntryModel(id, description, start, end, type));
    }
  }, [onSave, id, type, description, start, end]);

  const handleTypeChange = useCallback(
    (event: ChangeEvent<{ value: unknown }>) => {
      if (isString(event.target.value)) {
        dispatch(SetTimeAbsenceEntryTypeAction(event.target.value as TimeAbsenceEntryTypes));
      }
    },
    [dispatch],
  );

  const handleStartChange = useCallback(
    (date: MaterialUiPickersDate) =>
      dispatch(SetTimeAbsenceEntryStartAction(!!date ? date : new Date())),
    [dispatch],
  );

  const handleEndChange = useCallback(
    (date: MaterialUiPickersDate) =>
      dispatch(SetTimeAbsenceEntryEndAction(!!date ? date : new Date())),
    [dispatch],
  );

  const handleDescriptionChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) =>
      dispatch(SetTimeAbsenceEntryDescriptionAction(event.currentTarget.value)),
    [dispatch],
  );

  useEffect(() => {
    if (!model.isEmpty()) {
      dispatch(SetModel(model));
    }
  }, [dispatch, model]);

  return (
    <div className={classes.container}>
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
      <MuiPickersUtilsProvider utils={DateFnsUtils} locale={getDatepickerLocale(selectedLanguage)}>
        <KeyboardDateTimePicker
          autoOk
          ampm={false}
          value={start}
          maxDate={end}
          onChange={handleStartChange}
          label={<Trans>Labels.Start</Trans>}
          fullWidth
        />
        <KeyboardDateTimePicker
          autoOk
          ampm={false}
          value={end}
          minDate={start}
          onChange={handleEndChange}
          label={<Trans>Labels.End</Trans>}
          fullWidth
        />
      </MuiPickersUtilsProvider>
      <Divider />
      <ButtonSpinner
        onClick={handleSave}
        isBusy={isBusy}
        disabled={!start || !end || start > end || isBusy}
        className={classes.selfCenter}
      >
        {model.isEmpty() ? (
          <>
            {getTransFromAbsenceType(type)}
            <SaveIcon className={classes.marginLeft} />
          </>
        ) : (
          <>
            <Trans>Buttons.Update</Trans>
            <SaveIcon className={classes.marginLeft} />
          </>
        )}
      </ButtonSpinner>
    </div>
  );
};
