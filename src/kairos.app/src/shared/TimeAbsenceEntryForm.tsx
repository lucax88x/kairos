import DateFnsUtils from '@date-io/date-fns';
import { Trans } from '@lingui/macro';
import {
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
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import { map } from 'ramda';
import React, { ChangeEvent, useCallback, useEffect } from 'react';
import { formatAsDateTime } from '../code/constants';
import { getDatepickerLocale } from '../code/get-datepicker-locale';
import { isString } from '../code/is';
import ButtonSpinner from '../components/ButtonSpinner';
import { YouNeedAtLeastOneJob } from '../components/YouNeedAtLeastOneJob';
import { Language } from '../models/language-model';
import { ProfileModel } from '../models/profile.model';
import {
  getTransFromAbsenceType,
  TimeAbsenceEntryModel,
  TimeAbsenceEntryTypes,
} from '../models/time-absence-entry.model';
import { UUID } from '../models/uuid.model';
import {
  RefreshSelectsTimeAbsenceEntryAction,
  ResetModel,
  SetModel,
  SetTimeAbsenceEntryDescriptionAction,
  SetTimeAbsenceEntryEndAction,
  SetTimeAbsenceEntrySelectedJobAction,
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
  isOnline: boolean;
  selectedLanguage: Language;
  profile: ProfileModel;
  model: TimeAbsenceEntryModel;
  isBusy: boolean;
  onSave: (model: TimeAbsenceEntryModel) => void;
}

export const TimeAbsenceEntryForm: React.FC<TimeAbsenceEntryFormProps> = props => {
  const classes = useStyles(props);

  const { isOnline, selectedLanguage, isBusy, profile, model, onSave } = props;

  const [state, dispatch] = useTimeAbsenceEntryFormReducer();
  const { id, type, description, start, end, jobs, selectedJobId } = state;

  useEffect(() => {
    dispatch(RefreshSelectsTimeAbsenceEntryAction(profile));
  }, [dispatch, profile]);

  const handleSave = useCallback(() => {
    if (!!start && !!end) {
      onSave(
        new TimeAbsenceEntryModel(
          id,
          description,
          start,
          end,
          type,
          new UUID(selectedJobId),
        ),
      );
    }
  }, [onSave, id, type, description, start, end, selectedJobId]);

  const handleTypeChange = useCallback(
    (event: ChangeEvent<{ value: unknown }>) => {
      if (isString(event.target.value)) {
        dispatch(
          SetTimeAbsenceEntryTypeAction(
            event.target.value as TimeAbsenceEntryTypes,
          ),
        );
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

  const handleJobChange = useCallback(
    (event: ChangeEvent<{ value: unknown }>) => {
      if (isString(event.target.value)) {
        dispatch(SetTimeAbsenceEntrySelectedJobAction(event.target.value));
        dispatch(RefreshSelectsTimeAbsenceEntryAction(profile));
      }
    },
    [dispatch, profile],
  );

  useEffect(() => {
    if (!TimeAbsenceEntryModel.isEmpty(model)) {
      dispatch(SetModel(model));
    } else {
      dispatch(ResetModel());
    }
  }, [dispatch, model]);

  if (profile.jobs.length === 0) {
    return (
      <div className={classes.hasPadding}>
        <YouNeedAtLeastOneJob />
      </div>
    );
  }

  return (
    <div className={classes.container}>
      <FormControl fullWidth>
        <InputLabel htmlFor="type">
          <Trans>Type</Trans>
        </InputLabel>
        <Select
          value={type}
          onChange={handleTypeChange}
          inputProps={{
            id: 'type',
          }}
        >
          <MenuItem value={TimeAbsenceEntryTypes.ILLNESS}>
            <Trans>Illness</Trans>
          </MenuItem>
          <MenuItem value={TimeAbsenceEntryTypes.VACATION}>
            <Trans>Vacation</Trans>
          </MenuItem>
          <MenuItem value={TimeAbsenceEntryTypes.PERMIT}>
            <Trans>Permit</Trans>
          </MenuItem>
          <MenuItem value={TimeAbsenceEntryTypes.COMPENSATION}>
            <Trans>Compensation</Trans>
          </MenuItem>
        </Select>
      </FormControl>
      <TextField
        autoFocus
        margin="dense"
        id="description"
        label={<Trans>Description</Trans>}
        type="text"
        value={description}
        onChange={handleDescriptionChange}
        fullWidth
      />
      <MuiPickersUtilsProvider
        utils={DateFnsUtils}
        locale={getDatepickerLocale(selectedLanguage)}
      >
        <KeyboardDateTimePicker
          autoOk
          ampm={false}
          value={start}
          maxDate={end}
          onChange={handleStartChange}
          label={<Trans>Start</Trans>}
          invalidDateMessage={<Trans>Invalid Date</Trans>}
          format={formatAsDateTime}
          fullWidth
        />
        <KeyboardDateTimePicker
          autoOk
          ampm={false}
          value={end}
          minDate={start}
          onChange={handleEndChange}
          label={<Trans>End</Trans>}
          invalidDateMessage={<Trans>Invalid Date</Trans>}
          format={formatAsDateTime}
          fullWidth
        />
      </MuiPickersUtilsProvider>
      <div>
        <FormControl fullWidth>
          <InputLabel htmlFor="job">
            <Trans>Job</Trans>
          </InputLabel>
          <Select
            value={selectedJobId}
            onChange={handleJobChange}
            disabled={jobs.length === 1}
            inputProps={{
              id: 'job',
            }}
          >
            {map(
              job => (
                <MenuItem key={job.id.toString()} value={job.id.toString()}>
                  {job.name}
                </MenuItem>
              ),
              jobs,
            )}
          </Select>
        </FormControl>
      </div>
      <ButtonSpinner
        onClick={handleSave}
        isBusy={isBusy}
        disabled={!isOnline || !start || !end || start > end || isBusy}
        className={classes.selfCenter}
      >
        {TimeAbsenceEntryModel.isEmpty(model) ? (
          <>
            {getTransFromAbsenceType(type)}
            <SaveIcon className={classes.marginLeft} />
          </>
        ) : (
          <>
            <Trans>Update</Trans>
            <SaveIcon className={classes.marginLeft} />
          </>
        )}
      </ButtonSpinner>
    </div>
  );
};
