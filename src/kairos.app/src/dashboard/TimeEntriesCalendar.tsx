import { makeStyles } from '@material-ui/styles';
import { endOfYear, startOfYear } from 'date-fns';
import moment from 'moment';
import { join, map } from 'ramda';
import React, { useCallback, useEffect, useState } from 'react';
import { Calendar, Event, momentLocalizer } from 'react-big-calendar';
import { getEnterExitPairs } from '../code/calculator';
import { Themes } from '../code/variables';
import Spinner from '../components/Spinner';
import { TimeAbsenceEntryModel } from '../models/time-absence-entry.model';
import { TimeEntryListModel } from '../models/time-entry-list.model';
import { TimeHolidayEntryModel } from '../models/time-holiday-entry.model';

const localizer = momentLocalizer(moment);

const useStyles = makeStyles({
  calendar: {
    minHeight: '400px',
  },
  work: {
    backgroundColor: Themes.First.backgroundColor,
    color: Themes.First.color,
  },
  absence: {
    backgroundColor: Themes.Second.backgroundColor,
    color: Themes.Second.color,
  },
  holiday: {
    backgroundColor: Themes.Third.backgroundColor,
    color: Themes.Third.color,
  },
});

export interface TimeEntriesCalendarInputs {
  isGetTimeEntriesBusy: boolean;
  timeEntries: TimeEntryListModel[];

  isGetTimeAbsenceEntriesBusy: boolean;
  timeAbsenceEntries: TimeAbsenceEntryModel[];

  isGetTimeHolidayEntriesBusy: boolean;
  timeHolidayEntries: TimeHolidayEntryModel[];
}

enum EventType {
  Holiday = -1,
  Absence = 0,
  Work = 1,
}

type TimeEntriesCalendarEntryProps = TimeEntriesCalendarInputs;

export const TimeEntriesCalendarComponent: React.FC<TimeEntriesCalendarEntryProps> = props => {
  const classes = useStyles(props);

  const {
    isGetTimeEntriesBusy,
    timeEntries,
    isGetTimeAbsenceEntriesBusy,
    timeAbsenceEntries,
    isGetTimeHolidayEntriesBusy,
    timeHolidayEntries,
  } = props;

  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const pairs = getEnterExitPairs(timeEntries, {
      start: startOfYear(new Date()),
      end: endOfYear(new Date()),
    });

    const entries = map(
      ({ enter, exit }) => ({ start: enter, end: exit, title: 'Work', resource: EventType.Work }),
      pairs,
    );

    const absences = map(
      ab => ({
        start: ab.start,
        end: ab.end,
        title: join(' ', [ab.type, ab.description]),
        resource: EventType.Absence,
      }),
      timeAbsenceEntries,
    );

    const holidays = map(
      hol => ({
        start: hol.start,
        end: hol.end,
        title: hol.description,
        resource: EventType.Holiday,
      }),
      timeHolidayEntries,
    );

    setEvents([...entries, ...absences, ...holidays]);
  }, [timeEntries, timeAbsenceEntries, timeHolidayEntries]);

  const eventPropGetter = useCallback(
    (event: Event, start: string | Date, end: string | Date, isSelected: boolean) => {
      if (event.resource === EventType.Work) {
        return { className: classes.work };
      }
      if (event.resource === EventType.Absence) {
        return { className: classes.absence };
      }
      if (event.resource === EventType.Holiday) {
        return { className: classes.holiday };
      }

      return {};
    },
    [],
  );

  return (
    <Spinner
      show={isGetTimeEntriesBusy || isGetTimeAbsenceEntriesBusy || isGetTimeHolidayEntriesBusy}
    >
      <Calendar
        className={classes.calendar}
        localizer={localizer}
        events={events}
        eventPropGetter={eventPropGetter}
      />
    </Spinner>
  );
};
