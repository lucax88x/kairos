import DateFnsUtils from '@date-io/date-fns';
import { Trans } from '@lingui/macro';
import { Button, List, makeStyles } from '@material-ui/core';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import { addDays, endOfDay, format, fromUnixTime, startOfDay } from 'date-fns';
import { map } from 'ramda';
import React, { useCallback, useEffect, useState } from 'react';
import { formatAsDate } from '../code/constants';
import { getDatepickerLocale } from '../code/get-datepicker-locale';
import {
  isTimeAbsenceEntryListModel,
  isTimeEntryListModel,
  isTimeHolidayEntryModel,
} from '../code/is';
import Spinner from '../components/Spinner';
import { EntryModel } from '../models/entry-list-model';
import { Language } from '../models/language-model';
import { TimeAbsenceEntryListModel } from '../models/time-absence-entry-list.model';
import { TimeEntryListModel } from '../models/time-entry-list.model';
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
  rows: {
    display: 'grid',
    justifyContent: 'center',
    alignItems: 'center',
    gridGap: theme.spacing(3),
  },
  center: {
    textAlign: 'center',
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
    onChange,
    onEditTimeEntry,
    onEditTimeAbsence,
    onEditTimeHoliday,
    onDeleteTimeEntry,
    onDeleteTimeAbsence,
    onDeleteTimeHoliday,
  } = props;

  // const [selectedPreset, setSelectedPreset] = useState<string>('custom');
  const [start, setStart] = useState<Date>(startOfDay(new Date()));
  const [end, setEnd] = useState<Date>(endOfDay(new Date()));

  // const handlePresetChange = useCallback(
  //   (event: ChangeEvent<{ value: unknown }>) => {
  //     if (isString(event.target.value)) {
  //       setSelectedPreset(event.target.value);
  //     }
  //   },
  //   [setSelectedPreset],
  // );
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

  useEffect(() => {
    setStart(startDate);
    setEnd(endDate);
  }, [startDate, endDate, setStart, setEnd]);

  const dates = Object.keys(entriesByDate);

  return (
    <div className={classes.root}>
      <Spinner show={isBusy}>
        <div className={classes.rows}>
          {/* <Select
            fullWidth
            value={selectedPreset}
            onChange={handlePresetChange}
          >
            <MenuItem value="custom">Custom</MenuItem>
            <MenuItem value="custom1">Custom</MenuItem>
            <MenuItem value="custom2">Custom</MenuItem>
          </Select> */}
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
          {!!dates && !!dates.length ? (
            map(key => {
              const entries = entriesByDate[key];

              const renderedEntries = map(entry => {
                if (isTimeEntryListModel(entry)) {
                  return (
                    <NavigatorTimeEntryItem
                      key={entry.id.toString()}
                      entry={entry}
                      onEdit={onEditTimeEntry}
                      onDelete={onDeleteTimeEntry}
                    ></NavigatorTimeEntryItem>
                  );
                } else if (isTimeAbsenceEntryListModel(entry)) {
                  return (
                    <NavigatorTimeAbsenceItem
                      key={entry.id.toString()}
                      absence={entry}
                      onEdit={onEditTimeAbsence}
                      onDelete={onDeleteTimeAbsence}
                    ></NavigatorTimeAbsenceItem>
                  );
                } else if (isTimeHolidayEntryModel(entry)) {
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

              return (
                <List key={key}>
                  <div className={classes.center}>
                    {format(fromUnixTime(parseInt(key)), formatAsDate)}
                  </div>
                  {renderedEntries}
                </List>
              );
            }, dates)
          ) : (
            <Trans>No Entries for this range</Trans>
          )}
        </div>
      </Spinner>
    </div>
  );
};
