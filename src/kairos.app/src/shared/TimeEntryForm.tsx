import DateFnsUtils from '@date-io/date-fns';
import { Trans } from '@lingui/macro';
import {
  FormControl,
  FormControlLabel,
  InputLabel,
  makeStyles,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
} from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import {
  KeyboardDateTimePicker,
  MaterialUiPickersDate,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
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
  getIconFromEntryType,
  getTransFromEntryType,
  TimeEntryModel,
  TimeEntryTypes,
} from '../models/time-entry.model';
import { UUID } from '../models/uuid.model';
import {
  RefreshSelectsTimeEntryAction,
  ResetModel,
  SetModel,
  SetTimeEntrySelectedJobAction,
  SetTimeEntryTypeAction,
  SetTimeEntryWhenAction,
  useTimeEntryFormReducer,
} from './TimeEntryForm.store';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'grid',
    padding: theme.spacing(3),
    gridGap: theme.spacing(1),
  },
  fabs: {
    display: 'grid',
    gridGap: theme.spacing(1),
    justifyContent: 'center',
    alignItems: 'center',
    gridAutoFlow: 'column',
  },
  button: {
    display: 'grid',
    gridGap: theme.spacing(1),
    justifyContent: 'center',
    alignItems: 'center',
    gridAutoFlow: 'column',
  },
  hasPadding: {
    padding: theme.spacing(3),
  },
  marginLeft: {
    marginLeft: theme.spacing(1),
  },
  selfCenter: {
    justifySelf: 'center',
  },
}));

export interface TimeEntryFormProps {
  isOnline: boolean;
  selectedLanguage: Language;
  profile: ProfileModel;
  model: TimeEntryModel;
  isCreateAsInBusy: boolean;
  isCreateAsOutBusy: boolean;
  isUpdateBusy: boolean;
  onSave: (model: TimeEntryModel) => void;
}

export const TimeEntryForm: React.FC<TimeEntryFormProps> = props => {
  const classes = useStyles(props);

  const {
    isOnline,
    selectedLanguage,
    isCreateAsInBusy,
    isCreateAsOutBusy,
    isUpdateBusy,
    profile,
    model,
    onSave,
  } = props;

  const [state, dispatch] = useTimeEntryFormReducer();
  const { id, when, type, jobs, selectedJobId } = state;

  useEffect(() => {
    dispatch(RefreshSelectsTimeEntryAction(profile));
  }, [dispatch, profile]);

  const handleSave = useCallback(
    (type: TimeEntryTypes) => {
      if (!!when) {
        dispatch(SetTimeEntryTypeAction(type));
        onSave(new TimeEntryModel(id, when, type, new UUID(selectedJobId)));
      }
    },
    [onSave, id, when, selectedJobId, dispatch],
  );

  const handleSaveAsIn = useCallback(() => handleSave(TimeEntryTypes.IN), [
    handleSave,
  ]);

  const handleSaveAsOut = useCallback(() => handleSave(TimeEntryTypes.OUT), [
    handleSave,
  ]);

  const handleUpdate = useCallback(() => {
    if (!!when) {
      onSave(new TimeEntryModel(id, when, type, new UUID(selectedJobId)));
    }
  }, [onSave, id, when, selectedJobId, type]);

  const handleWhenChange = useCallback(
    (when: MaterialUiPickersDate) => {
      dispatch(SetTimeEntryWhenAction(!!when ? when : new Date()));
      dispatch(RefreshSelectsTimeEntryAction(profile));
    },
    [dispatch, profile],
  );

  const handleJobChange = useCallback(
    (event: ChangeEvent<{ value: unknown }>) => {
      if (isString(event.target.value)) {
        dispatch(SetTimeEntrySelectedJobAction(event.target.value));
        dispatch(RefreshSelectsTimeEntryAction(profile));
      }
    },
    [dispatch, profile],
  );

  const handleTypeChange = useCallback(
    (_, value: string) =>
      dispatch(SetTimeEntryTypeAction(value as TimeEntryTypes)),
    [dispatch],
  );

  useEffect(() => {
    if (!TimeEntryModel.isEmpty(model)) {
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

  const isSaveDisabled = !isOnline || !when || selectedJobId === UUID.Empty;

  return (
    <div className={classes.container}>
      {!TimeEntryModel.isEmpty(model) && (
        <FormControl component="fieldset" className={classes.selfCenter}>
          <RadioGroup
            aria-label="timeEntryType"
            name="timeEntryType"
            row
            value={type}
            onChange={handleTypeChange}
          >
            <FormControlLabel
              value={TimeEntryTypes.IN}
              control={<Radio />}
              label={getIconFromEntryType(TimeEntryTypes.IN)}
            />
            <FormControlLabel
              value={TimeEntryTypes.OUT}
              control={<Radio />}
              label={getIconFromEntryType(TimeEntryTypes.OUT)}
            />
          </RadioGroup>
        </FormControl>
      )}
      <MuiPickersUtilsProvider
        utils={DateFnsUtils}
        locale={getDatepickerLocale(selectedLanguage)}
      >
        <KeyboardDateTimePicker
          fullWidth
          margin="normal"
          ampm={false}
          autoOk
          value={when}
          onChange={handleWhenChange}
          format={formatAsDateTime}
          label={<Trans>When</Trans>}
          invalidDateMessage={<Trans>Invalid Date</Trans>}
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
      {!TimeEntryModel.isEmpty(model) ? (
        <ButtonSpinner
          onClick={handleUpdate}
          isBusy={isUpdateBusy}
          disabled={isSaveDisabled || isUpdateBusy}
          className={classes.selfCenter}
        >
          <Trans>Update</Trans>
          <SaveIcon className={classes.marginLeft} />
        </ButtonSpinner>
      ) : (
        <div className={classes.fabs}>
          <ButtonSpinner
            onClick={handleSaveAsIn}
            isBusy={isCreateAsInBusy}
            disabled={isCreateAsOutBusy || isSaveDisabled}
            className={classes.button}
            color="primary"
          >
            <div className={classes.button}>
              {getIconFromEntryType(TimeEntryTypes.IN)}
              {getTransFromEntryType(TimeEntryTypes.IN)}
            </div>
          </ButtonSpinner>
          <ButtonSpinner
            onClick={handleSaveAsOut}
            isBusy={isCreateAsOutBusy}
            disabled={isCreateAsInBusy || isSaveDisabled}
            color="primary"
          >
            <div className={classes.button}>
              {getIconFromEntryType(TimeEntryTypes.OUT)}
              {getTransFromEntryType(TimeEntryTypes.OUT)}
            </div>
          </ButtonSpinner>
        </div>
      )}
    </div>
  );
};
