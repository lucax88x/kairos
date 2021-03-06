import DateFnsUtils from '@date-io/date-fns';
import { Trans } from '@lingui/macro';
import {
  Button,
  Checkbox,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  List,
  makeStyles,
  MenuItem,
  Select,
  Typography,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import RefreshIcon from '@material-ui/icons/Refresh';
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import {
  addDays,
  endOfDay,
  endOfMonth,
  endOfWeek,
  endOfYear,
  format,
  fromUnixTime,
  getMonth,
  getWeek,
  getYear,
  setMonth,
  setWeek,
  setYear,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
} from 'date-fns';
import { filter, map } from 'ramda';
import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { formatAsDate } from '../code/constants';
import { getDatepickerLocale } from '../code/get-datepicker-locale';
import {
  isString,
  isTimeAbsenceEntryListModel,
  isTimeEntryListModel,
  isTimeHolidayEntryModel,
} from '../code/is';
import Spinner from '../components/Spinner';
import { EntryModel } from '../models/entry-list-model';
import { Language } from '../models/language-model';
import { TimeAbsenceEntryListModel } from '../models/time-absence-entry-list.model';
import {
  getTransFromAbsenceType,
  TimeAbsenceEntryTypes,
} from '../models/time-absence-entry.model';
import { TimeEntryListModel } from '../models/time-entry-list.model';
import {
  getTransFromEntryType,
  TimeEntryTypes,
} from '../models/time-entry.model';
import { TimeHolidayEntryModel } from '../models/time-holiday-entry.model';
import { NavigatorTimeAbsenceItem } from './NavigatorTimeAbsenceItem';
import { NavigatorTimeEntryItem } from './NavigatorTimeEntryItem';
import { NavigatorTimeHolidayItem } from './NavigatorTimeHolidayItem';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'grid',
    gridGap: theme.spacing(1),
  },
  columns: {
    display: 'grid',
    justifyContent: 'center',
    alignItems: 'center',
    gridAutoFlow: 'column',
    gridGap: theme.spacing(3),
  },
  head: {
    display: 'grid',
    alignItems: 'center',
    gridTemplateColumns: 'auto min-content',
    gridGap: theme.spacing(1),
  },
  rows: {
    display: 'grid',
    justifyContent: 'center',
    alignItems: 'center',
    gridGap: theme.spacing(3),
  },
  center: {
    textAlign: 'center',
  },
  entryRows: {
    display: 'grid',
  },
}));

export interface NavigatorInputs {
  selectedLanguage: Language;
  startDate: Date;
  endDate: Date;
  isBusy: boolean;
  entriesByDate: { [date: string]: EntryModel[] };
}

export interface NavigatorDispatches {
  onRefresh: () => void;
  onChange: (filters: { start: Date; end: Date }) => void;
  onEditTimeEntry: (entry: TimeEntryListModel) => void;
  onEditTimeAbsence: (absence: TimeAbsenceEntryListModel) => void;
  onEditTimeHoliday: (holiday: TimeHolidayEntryModel) => void;
  onDeleteTimeEntry: (entry: TimeEntryListModel) => void;
  onDeleteTimeAbsence: (absence: TimeAbsenceEntryListModel) => void;
  onDeleteTimeHoliday: (holiday: TimeHolidayEntryModel) => void;
}

type NavigatorProps = NavigatorInputs & NavigatorDispatches;

export const NavigatorComponent: React.FC<NavigatorProps> = props => {
  const classes = useStyles(props);

  const {
    selectedLanguage,
    isBusy,
    entriesByDate,
    startDate,
    endDate,
    onRefresh,
    onChange,
    onEditTimeEntry,
    onEditTimeAbsence,
    onEditTimeHoliday,
    onDeleteTimeEntry,
    onDeleteTimeAbsence,
    onDeleteTimeHoliday,
  } = props;

  const [selectedPreset, setSelectedPreset] = useState<string>('custom');
  const [start, setStart] = useState<Date>(startOfDay(new Date()));
  const [end, setEnd] = useState<Date>(endOfDay(new Date()));
  const [entryTypes, setEntryTypes] = useState<{ [key: string]: boolean }>({
    [TimeEntryTypes.IN]: true,
    [TimeEntryTypes.OUT]: true,
  });
  const [absenceTypes, setAbsenceTypes] = useState<{ [key: string]: boolean }>({
    [TimeAbsenceEntryTypes.VACATION]: true,
    [TimeAbsenceEntryTypes.ILLNESS]: true,
    [TimeAbsenceEntryTypes.COMPENSATION]: true,
    [TimeAbsenceEntryTypes.PERMIT]: true,
  });
  const [holidayType, setHolidayType] = useState(true);

  const getRangeByPreset = useCallback((preset: string) => {
    let date = new Date();
    switch (preset) {
      default:
      case 'custom':
        return { start: startOfDay(date), end: endOfDay(date) };
      case 'current-week':
        return { start: startOfWeek(date), end: endOfWeek(date) };
      case 'previous-week':
        date = setWeek(date, getWeek(date) - 1);
        return { start: startOfWeek(date), end: endOfWeek(date) };
      case 'current-month':
        return { start: startOfMonth(date), end: endOfMonth(date) };
      case 'previous-month':
        date = setMonth(date, getMonth(date) - 1);
        return { start: startOfMonth(date), end: endOfMonth(date) };
      case 'current-year':
        return { start: startOfYear(date), end: endOfYear(date) };
      case 'previous-year':
        date = setYear(date, getYear(date) - 1);
        return { start: startOfYear(date), end: endOfYear(date) };
    }
  }, []);

  const handlePresetChange = useCallback(
    (event: ChangeEvent<{ value: unknown }>) => {
      if (isString(event.target.value)) {
        const preset = event.target.value;
        setSelectedPreset(preset);

        const { start, end } = getRangeByPreset(preset);
        setStart(start);
        setEnd(end);
        onChange({ start, end });
      }
    },
    [getRangeByPreset, setSelectedPreset, setStart, setEnd, onChange],
  );

  const handleStartChange = useCallback(
    (date: MaterialUiPickersDate) => {
      if (!date) {
        date = startOfDay(end);
      }
      setStart(date);
      onChange({ start: date, end });
    },
    [end, setStart, onChange],
  );
  const handleEndChange = useCallback(
    (date: MaterialUiPickersDate) => {
      if (!date) {
        date = endOfDay(start);
      }
      setEnd(date);
      onChange({ start, end: date });
    },
    [start, setEnd, onChange],
  );

  const handlePrevious = useCallback(() => {
    const previous = addDays(start, -1);
    const newStart = startOfDay(previous);
    const newEnd = endOfDay(previous);
    setStart(newStart);
    setEnd(newEnd);
    onChange({ start: newStart, end: newEnd });
  }, [start, setStart, setEnd, onChange]);

  const handleNext = useCallback(() => {
    const next = addDays(start, 1);
    const newStart = startOfDay(next);
    const newEnd = endOfDay(next);
    setStart(newStart);
    setEnd(newEnd);
    onChange({ start: newStart, end: newEnd });
  }, [start, setStart, setEnd, onChange]);

  const handleEntryTypeChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) =>
      setEntryTypes({
        ...entryTypes,
        [event.currentTarget.value]: event.currentTarget.checked,
      }),
    [setEntryTypes, entryTypes],
  );

  const handleAbsenceTypeChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) =>
      setAbsenceTypes({
        ...absenceTypes,
        [event.currentTarget.value]: event.currentTarget.checked,
      }),
    [setAbsenceTypes, absenceTypes],
  );

  const handleHolidayTypeChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) =>
      setHolidayType(event.currentTarget.checked),
    [setHolidayType],
  );

  const handleRefresh = useCallback(() => onRefresh(), [onRefresh]);

  useEffect(() => {
    setStart(startDate);
    setEnd(endDate);
  }, [startDate, endDate, setStart, setEnd]);

  const dates = Object.keys(entriesByDate);

  return (
    <div className={classes.root}>
      <Spinner show={isBusy}>
        <div className={classes.rows}>
          <div className={classes.head}>
            <Select
              fullWidth
              value={selectedPreset}
              onChange={handlePresetChange}
            >
              <MenuItem value="custom">
                <Trans>Custom</Trans>
              </MenuItem>
              <MenuItem value="current-week">
                <Trans>Current Week</Trans>
              </MenuItem>
              <MenuItem value="previous-week">
                <Trans>Previous Week</Trans>
              </MenuItem>
              <MenuItem value="current-month">
                <Trans>Current Month</Trans>
              </MenuItem>
              <MenuItem value="previous-month">
                <Trans>Previous Month</Trans>
              </MenuItem>
              <MenuItem value="current-year">
                <Trans>Current Year</Trans>
              </MenuItem>
              <MenuItem value="previous-year">
                <Trans>Previous Year</Trans>
              </MenuItem>
            </Select>

            <Button
              color="primary"
              variant="contained"
              onClick={handleRefresh}
              autoFocus
            >
              <RefreshIcon></RefreshIcon>
            </Button>
          </div>
          <MuiPickersUtilsProvider
            utils={DateFnsUtils}
            locale={getDatepickerLocale(selectedLanguage)}
          >
            <div className={classes.columns}>
              <Button onClick={handlePrevious}>
                <KeyboardArrowLeftIcon></KeyboardArrowLeftIcon>
              </Button>
              <KeyboardDatePicker
                autoOk
                value={start}
                maxDate={end}
                onChange={handleStartChange}
                label={<Trans>Start</Trans>}
                invalidDateMessage={<Trans>Invalid Date</Trans>}
                format={formatAsDate}
                fullWidth
              />
              <KeyboardDatePicker
                value={end}
                minDate={start}
                onChange={handleEndChange}
                label={<Trans>End</Trans>}
                invalidDateMessage={<Trans>Invalid Date</Trans>}
                format={formatAsDate}
                fullWidth
              />
              <Button onClick={handleNext}>
                <KeyboardArrowRightIcon></KeyboardArrowRightIcon>
              </Button>
            </div>
          </MuiPickersUtilsProvider>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="filters-content"
              id="filters-header"
            >
              <Typography>
                <Trans>Filters</Trans>
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <FormControl component="fieldset">
                <FormLabel component="legend">
                  <Trans>Types</Trans>
                </FormLabel>
                <FormGroup row={true}>
                  {map(
                    entryType => (
                      <FormControlLabel
                        key={entryType}
                        control={
                          <Checkbox
                            checked={entryTypes[entryType]}
                            onChange={handleEntryTypeChange}
                            value={entryType}
                          />
                        }
                        label={getTransFromEntryType(entryType)}
                      />
                    ),
                    [TimeEntryTypes.IN, TimeEntryTypes.OUT],
                  )}
                  {map(
                    absenceType => (
                      <FormControlLabel
                        key={absenceType}
                        control={
                          <Checkbox
                            checked={absenceTypes[absenceType]}
                            onChange={handleAbsenceTypeChange}
                            value={absenceType}
                          />
                        }
                        label={getTransFromAbsenceType(absenceType)}
                      />
                    ),
                    [
                      TimeAbsenceEntryTypes.VACATION,
                      TimeAbsenceEntryTypes.ILLNESS,
                      TimeAbsenceEntryTypes.COMPENSATION,
                      TimeAbsenceEntryTypes.PERMIT,
                    ],
                  )}
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={holidayType}
                        onChange={handleHolidayTypeChange}
                        value="holiday"
                      />
                    }
                    label={<Trans>Holiday</Trans>}
                  />
                </FormGroup>
              </FormControl>
            </AccordionDetails>
          </Accordion>

          <div className={classes.entryRows}>
            {!!dates && !!dates.length ? (
              map(key => {
                const entries = entriesByDate[key];

                const renderedEntries = map(entry => {
                  if (isTimeEntryListModel(entry) && entryTypes[entry.type]) {
                    return (
                      <NavigatorTimeEntryItem
                        key={entry.id.toString()}
                        entry={entry}
                        onEdit={onEditTimeEntry}
                        onDelete={onDeleteTimeEntry}
                      ></NavigatorTimeEntryItem>
                    );
                  } else if (
                    isTimeAbsenceEntryListModel(entry) &&
                    absenceTypes[entry.type]
                  ) {
                    return (
                      <NavigatorTimeAbsenceItem
                        key={entry.id.toString()}
                        absence={entry}
                        onEdit={onEditTimeAbsence}
                        onDelete={onDeleteTimeAbsence}
                      ></NavigatorTimeAbsenceItem>
                    );
                  } else if (isTimeHolidayEntryModel(entry) && holidayType) {
                    return (
                      <NavigatorTimeHolidayItem
                        key={entry.id.toString()}
                        holiday={entry}
                        onEdit={onEditTimeHoliday}
                        onDelete={onDeleteTimeHoliday}
                      ></NavigatorTimeHolidayItem>
                    );
                  } else {
                    return null;
                  }
                }, entries);

                const validRenderedEntities = filter(
                  e => e !== null,
                  renderedEntries,
                );

                return (
                  !!validRenderedEntities.length && (
                    <List key={key}>
                      <div className={classes.center}>
                        {format(fromUnixTime(parseInt(key)), formatAsDate)}
                      </div>
                      {validRenderedEntities}
                    </List>
                  )
                );
              }, dates)
            ) : (
              <Trans>No Entries for this range</Trans>
            )}
          </div>
        </div>
      </Spinner>
    </div>
  );
};
