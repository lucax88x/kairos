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

export interface TimeEntryFormProps {
  selectedLanguage: Language;
  profile: ProfileModel;
  model: TimeEntryModel;
  isBusy: boolean;
  onSave: (model: TimeEntryModel) => void;
}

export const TimeEntryForm: React.FC<TimeEntryFormProps> = props => {
  const classes = useStyles(props);

  const { selectedLanguage, isBusy, profile, model, onSave } = props;

  const [state, dispatch] = useTimeEntryFormReducer();
  const { id, when, type, jobs, selectedJobId } = state;

  useEffect(() => {
    dispatch(RefreshSelectsTimeEntryAction(profile));
  }, [dispatch, profile]);

  const handleSave = useCallback(() => {
    if (!!when) {
      onSave(new TimeEntryModel(id, when, type, new UUID(selectedJobId)));
    }
  }, [onSave, id, type, when, selectedJobId]);

  const handleTypeChange = useCallback(
    (_, value: string) =>
      dispatch(SetTimeEntryTypeAction(value as TimeEntryTypes)),
    [dispatch],
  );

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

  useEffect(() => {
    if (!model.isEmpty()) {
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
            label={<Trans>Values.TimeEntryTypes.In</Trans>}
          />
          <FormControlLabel
            value={TimeEntryTypes.OUT}
            control={<Radio />}
            label={<Trans>Values.TimeEntryTypes.Out</Trans>}
          />
        </RadioGroup>
      </FormControl>
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
          label={<Trans>Labels.When</Trans>}
          invalidDateMessage={<Trans>Validation.InvalidDate</Trans>}
        />
      </MuiPickersUtilsProvider>
      <div>
        <FormControl fullWidth>
          <InputLabel htmlFor="job">
            <Trans>Labels.Job</Trans>
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
        disabled={!when || selectedJobId === UUID.Empty || isBusy}
        className={classes.selfCenter}
      >
        {model.isEmpty() ? (
          <>
            {getTransFromEntryType(type)}
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
