import { makeStyles } from '@material-ui/styles';
import { endOfDay, endOfYear, startOfDay, startOfYear } from 'date-fns';
import moment from 'moment';
import { join, map } from 'ramda';
import React, { useCallback, useEffect, useState } from 'react';
import { Calendar, Event, Messages, momentLocalizer } from 'react-big-calendar';
import { getTimeEntryPairsById } from '../code/calculator';
import { Themes } from '../code/variables';
import Spinner from '../components/Spinner';
import { i18n } from '../i18nLoader';
import { Language } from '../models/language-model';
import { getTextFromAbsenceType, TimeAbsenceEntryModel } from '../models/time-absence-entry.model';
import { TimeEntryListModel } from '../models/time-entry-list.model';
import { TimeHolidayEntryModel } from '../models/time-holiday-entry.model';
import { Routes } from '../routes';

const localizer = momentLocalizer(moment);

enum EventType {
  Holiday = -1,
  Absence = 0,
  Work = 1,
}

const useStyles = makeStyles({
  calendar: {
    minHeight: '400px',
    '& a': {
      color: Themes.First.color,
      padding: '2px 5px',
    },
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
  selectedLanguage: Language;

  isGetTimeEntriesBusy: boolean;
  timeEntries: TimeEntryListModel[];

  isGetTimeAbsenceEntriesBusy: boolean;
  timeAbsenceEntries: TimeAbsenceEntryModel[];

  isGetTimeHolidayEntriesBusy: boolean;
  timeHolidayEntries: TimeHolidayEntryModel[];
}

export interface TimeEntriesCalendarDispatches {
  onNavigate: (url: string) => void;
}

type TimeEntriesCalendarEntryProps = TimeEntriesCalendarInputs & TimeEntriesCalendarDispatches;

export const TimeEntriesCalendarComponent: React.FC<TimeEntriesCalendarEntryProps> = props => {
  const classes = useStyles(props);

  const {
    selectedLanguage,
    isGetTimeEntriesBusy,
    timeEntries,
    isGetTimeAbsenceEntriesBusy,
    timeAbsenceEntries,
    isGetTimeHolidayEntriesBusy,
    timeHolidayEntries,
    onNavigate,
  } = props;

  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const pairs = getTimeEntryPairsById(timeEntries, {
      start: startOfYear(new Date()),
      end: endOfYear(new Date()),
    });

    const entries = map(
      ({ enter, exit, title, id }) => ({
        start: enter,
        end: exit,
        title,
        resource: { type: EventType.Work, id },
      }),
      pairs,
    );

    const absences = map(
      ab => ({
        start: ab.start,
        end: ab.end,
        title: join(' ', [getTextFromAbsenceType(ab.type), ab.description]),
        resource: { type: EventType.Absence, id: ab.id },
      }),
      timeAbsenceEntries,
    );

    const holidays = map(
      hol => ({
        start: startOfDay(hol.when),
        end: endOfDay(hol.when),
        title: hol.description,
        resource: { type: EventType.Holiday, id: hol.id },
      }),
      timeHolidayEntries,
    );

    setEvents([...entries, ...absences, ...holidays]);
  }, [timeEntries, timeAbsenceEntries, timeHolidayEntries]);

  const eventPropGetter = useCallback(
    (event: Event, start: string | Date, end: string | Date, isSelected: boolean) => {
      const { type } = event.resource;
      if (type === EventType.Work) {
        return { className: classes.work };
      }
      if (type === EventType.Absence) {
        return { className: classes.absence };
      }
      if (type === EventType.Holiday) {
        return { className: classes.holiday };
      }

      return {};
    },
    [classes],
  );

  const messages: Messages = {
    month: i18n._('Calendar.Month'),
    yesterday: i18n._('Calendar.Yesterday'),
    day: i18n._('Calendar.Day'),
    today: i18n._('Calendar.Today'),
    previous: i18n._('Calendar.Back'),
    next: i18n._('Calendar.Next'),
    week: i18n._('Calendar.Week'),
    work_week: i18n._('Calendar.WorkWeek'),
    agenda: i18n._('Calendar.Agenda'),
    noEventsInRange: i18n._('Calendar.NoEventsInRange'),
    allDay: i18n._('Calendar.AllDay'),
    showMore: more => i18n._('Calendar.ShowMore', { more }),
  };

  const handleOnDoubleClick = useCallback(
    (event: Event) => {
      const { type, id } = event.resource;
      switch (type as EventType) {
        case EventType.Work:
          onNavigate(Routes.EditTimeEntry.replace(':id', id.toString()));
          break;
        case EventType.Absence:
          onNavigate(Routes.EditTimeAbsenceEntry.replace(':id', id.toString()));
          break;
        case EventType.Holiday:
          onNavigate(Routes.EditTimeHolidayEntry.replace(':id', id.toString()));
          break;
        default:
          break;
      }
    },
    [onNavigate],
  );

  return (
    <Spinner
      show={isGetTimeEntriesBusy || isGetTimeAbsenceEntriesBusy || isGetTimeHolidayEntriesBusy}
    >
      <Calendar
        className={classes.calendar}
        localizer={localizer}
        culture={selectedLanguage}
        events={events}
        eventPropGetter={eventPropGetter}
        messages={messages}
        onDoubleClickEvent={handleOnDoubleClick}
      />
    </Spinner>
  );
};
