import { i18n } from '@lingui/core';
import {
  differenceInHours,
  endOfDay,
  format,
  getUnixTime,
  isFriday,
  isMonday,
  isSameDay,
  isSaturday,
  isSunday,
  isThursday,
  isTuesday,
  isWednesday,
  isWithinInterval,
  startOfDay,
} from 'date-fns';
import { ascend, filter, find, groupBy, map, sortWith, sum } from 'ramda';
import { JobModel } from '../models/job.model';
import { Language } from '../models/language-model';
import { ProfileModel } from '../models/profile.model';
import { TimeAbsenceEntryModel } from '../models/time-absence-entry.model';
import { TimeEntryListModel } from '../models/time-entry-list.model';
import { TimeEntryTypes } from '../models/time-entry.model';
import { TimeHolidayEntryModel } from '../models/time-holiday-entry.model';
import { UUID } from '../models/uuid.model';
import { formatAsDate } from './constants';
import { formatDate } from './formatters';
import { filterByInterval, humanDifference } from './functions';

export interface TimeEntryPair {
  enterId: UUID;
  job: string;
  enter: Date;
  exit: Date;
}

const getHoursFromAbsences = map<TimeAbsenceEntryModel, number>(t =>
  differenceInHours(t.end, t.start),
);

const r = differenceInHours(
  new Date('January 1 2019 09:30'),
  new Date('January 1 2019 10:00'),
);
console.log(r);

export function getTimeEntryPairsByJob(
  timeEntries: TimeEntryListModel[],
  interval: Interval,
): { [id: string]: TimeEntryPair[] } {
  const filteredByInterval = filterByInterval(interval)(timeEntries);
  const orderedByDate = sortWith([ascend(te => te.when)], filteredByInterval);
  const groupByDay = groupBy(
    te => format(startOfDay(te.when), formatAsDate),
    orderedByDate,
  );
  const pairsByJob: { [id: string]: TimeEntryPair[] } = {};

  for (const day in groupByDay) {
    const entriesByDay = groupByDay[day];

    for (let i = 0; i < entriesByDay.length; i++) {
      const entry = entriesByDay[i];

      const job = entry.job.id.toString();

      if (!pairsByJob[job]) {
        pairsByJob[job] = [];
      }

      if (entry.type === TimeEntryTypes.IN) {
        const [exit, toSkip] = getNearestExit(i, entriesByDay);
        i += toSkip;

        const pair: TimeEntryPair = {
          enterId: entry.id,
          enter: entry.when,
          job: entry.job.name,
          exit: new Date(0),
        };

        if (!exit.isEmpty()) {
          pairsByJob[job].push({
            ...pair,
            exit: exit.when,
          });
        } else {
          pairsByJob[job].push({
            ...pair,
            exit: isSameDay(new Date(), entry.when)
              ? new Date()
              : endOfDay(entry.when),
          });
        }
      } else if (i === 0) {
        // the first entry is an OUT, so we have no IN before
        const pair: TimeEntryPair = {
          enterId: entry.id,
          enter: startOfDay(entry.when),
          job: entry.job.name,
          exit: entry.when,
        };

        pairsByJob[job].push(pair);
      }
    }
  }

  return pairsByJob;
}

export function getDifferencesByRangeByJobAndDate(
  timeEntries: TimeEntryListModel[],
  interval: Interval,
) {
  const pairsByJob = getTimeEntryPairsByJob(timeEntries, interval);
  const differencesByJobAndDate: {
    [id: string]: { [date: number]: number };
  } = {};

  for (const job in pairsByJob) {
    const pairs = pairsByJob[job];

    if (!differencesByJobAndDate[job]) {
      differencesByJobAndDate[job] = {};
    }

    for (const { enter, exit } of pairs) {
      const unixDate = getUnixTime(startOfDay(enter));

      const diff = Math.abs(enter.getTime() - exit.getTime());

      differencesByJobAndDate[job][unixDate] = !!differencesByJobAndDate[job][
        unixDate
      ]
        ? differencesByJobAndDate[job][unixDate] + diff
        : diff;
    }
  }

  return differencesByJobAndDate;
}

export function getHumanDifferencesByRange(
  timeEntries: TimeEntryListModel[],
  interval: Interval,
) {
  const humanDifferencesByJobAndDate: {
    [id: string]: { [date: number]: string };
  } = {};

  const differencesByJobAndDate = getDifferencesByRangeByJobAndDate(
    timeEntries,
    interval,
  );
  for (const job in differencesByJobAndDate) {
    for (const date in differencesByJobAndDate[job]) {
      const difference = differencesByJobAndDate[job][date];

      if (!humanDifferencesByJobAndDate[job]) {
        humanDifferencesByJobAndDate[job] = {};
      }

      humanDifferencesByJobAndDate[job][date] = humanDifference(
        new Date(0),
        new Date(!!difference ? difference : 0),
      );
    }
  }

  return humanDifferencesByJobAndDate;
}

function getNearestExit(
  startingIndex: number,
  timeEntries: TimeEntryListModel[],
): [TimeEntryListModel, number] {
  let toSkip = 0;
  for (let i = startingIndex + 1; i < timeEntries.length; i++) {
    toSkip++;

    const nextTimeEntry = timeEntries[i];

    if (nextTimeEntry.type === TimeEntryTypes.OUT) {
      return [nextTimeEntry, toSkip];
    }
  }
  return [TimeEntryListModel.empty, toSkip];
}

export interface TimeStatisticTile {
  title: string;
  subtitle?: string;
  text: string;
}

export function getWorkingHoursStatistics(
  date: Date,
  language: Language,
  profile: ProfileModel,
  entries: TimeEntryListModel[],
  absences: TimeAbsenceEntryModel[],
  holidays: TimeHolidayEntryModel[],
): TimeStatisticTile[] {
  //# { title: 'remaining today', subtitle: 'Monday, 16', text: '8h' },
  // { title: 'remaining this week', subtitle: '12 -> 19', text: '30' },
  // { title: 'remaining this month', subtitle: 'August', text: '30' },
  // { title: 'done today', subtitle: 'July', text: '8h' },
  // { title: 'done this week', subtitle: 'July', text: '30' },
  // { title: 'done this month', subtitle: 'August', text: '50' },
  // { title: 'done previous month', subtitle: 'July', text: '30' },
  // { title: 'done all previous months', text: '30' },
  // { title: 'done this year', subtitle: '2019', text: '250' },
  // { title: 'done previous year', subtitle: '2018', text: '30' },
  // { title: 'done all previous years', text: '30' },
  // { title: 'overtime today', subtitle: 'July', text: '8h' },
  // { title: 'overtime this week', subtitle: 'July', text: '30' },
  // { title: 'overtime this month', subtitle: 'August', text: '50' },
  // { title: 'overtime previous month', subtitle: 'July', text: '30' },
  // { title: 'overtime all previous months', text: '30' },
  // { title: 'overtime this year', subtitle: '2019', text: '250' },
  // { title: 'overtime previous year', subtitle: '2018', text: '30' },
  // { title: 'overtime all previous years', text: '30' },

  const statistics: TimeStatisticTile[] = [];

  const maxDate = new Date(8640000000000000);

  const jobsInDate = filter(
    job =>
      isWithinInterval(date, {
        start: job.start,
        end: !!job.end ? job.end : maxDate,
      }),
    profile.jobs,
  );

  const differencesByDateByJob = getDifferencesByRangeByJobAndDate(entries, {
    start: startOfDay(date),
    end: endOfDay(date),
  });

  const absencesInDate = filter(
    absence =>
      isWithinInterval(date, {
        start: startOfDay(absence.start),
        end: endOfDay(absence.end),
      }),
    absences,
  );

  const holidayInDate = find(
    holiday =>
      isWithinInterval(date, {
        start: startOfDay(holiday.when),
        end: endOfDay(holiday.when),
      }),
    holidays,
  );

  for (const job of jobsInDate) {
    let remainingHours = 0;
    if (!!holidayInDate) {
      remainingHours = 0;
    } else {
      const absenceHours = sum(getHoursFromAbsences(absencesInDate));
      const differencesByDate = differencesByDateByJob[job.id.toString()];
      const difference = !!differencesByDate
        ? differencesByDate[getUnixTime(date)]
        : 0;
      const workingHours = getDayWorkingHours(date, job);
      const workedHours = !!difference ? difference / 3600000 : 0;

      remainingHours = workingHours - (workedHours + absenceHours);
      console.log(workingHours);
      console.log(absenceHours);
      console.log(workedHours);
      console.log(remainingHours);
    }

    statistics.push({
      title: i18n._(
        /*i18n*/ {
          id: 'TimeStatistics.RemainingToday',
          values: { job: job.name },
        },
      ),
      subtitle: formatDate(date, language, 'MMMM dd'),
      text: `${remainingHours}h`,
    });
  }

  return statistics;
}

export function getVacationStatistics(
  language: Language,
  absences: TimeAbsenceEntryModel[],
): TimeStatisticTile[] {
  // { title: 'remaining this year', subtitle: '2019', text: '0' },
  // { title: 'done this year', subtitle: '2019', text: '30' },
  // { title: 'remaining previous years', text: '30' },

  const statistics: TimeStatisticTile[] = [];

  return statistics;
}

export function getIllnessStatistics(
  language: Language,
  absences: TimeAbsenceEntryModel[],
): TimeStatisticTile[] {
  // { title: 'done this year', subtitle: '2019', text: '5d' }

  const statistics: TimeStatisticTile[] = [];

  return statistics;
}

function getDayWorkingHours(day: Date, job: JobModel): number {
  if (isMonday(day)) {
    return job.monday;
  }
  if (isTuesday(day)) {
    return job.tuesday;
  }
  if (isWednesday(day)) {
    return job.wednesday;
  }
  if (isThursday(day)) {
    return job.thursday;
  }
  if (isFriday(day)) {
    return job.friday;
  }
  if (isSaturday(day)) {
    return job.saturday;
  }
  if (isSunday(day)) {
    return job.sunday;
  }
  return 0;
}
