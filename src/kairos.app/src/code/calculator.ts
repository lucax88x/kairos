import {
  endOfDay,
  getUnixTime,
  isFriday,
  isMonday,
  isSaturday,
  isSunday,
  isThursday,
  isTuesday,
  isWednesday,
  isWithinInterval,
  startOfDay,
} from 'date-fns';
import { ascend, filter, sortWith } from 'ramda';
import { JobModel } from '../models/job.model';
import { Language } from '../models/language-model';
import { ProfileModel } from '../models/profile.model';
import { TimeAbsenceEntryModel } from '../models/time-absence-entry.model';
import { TimeEntryListModel } from '../models/time-entry-list.model';
import { TimeEntryTypes } from '../models/time-entry.model';
import { TimeHolidayEntryModel } from '../models/time-holiday-entry.model';
import { UUID } from '../models/uuid.model';
import { filterByInterval, humanDifference } from './functions';

export interface TimeEntryPair {
  enterId: UUID;
  job: string;
  enter: Date;
  exit: Date;
}

export function getTimeEntryPairsByJob(
  timeEntries: TimeEntryListModel[],
  interval: Interval,
): { [id: string]: TimeEntryPair[] } {
  const filteredByInterval = filterByInterval(interval)(timeEntries);
  const orderedByDate = sortWith([ascend(te => te.when)], filteredByInterval);
  const pairsByJob: { [id: string]: TimeEntryPair[] } = {};

  for (let i = 0; i < orderedByDate.length; i++) {
    const enter = orderedByDate[i];

    if (enter.type === TimeEntryTypes.IN) {
      const [exit, toSkip] = getNearestExit(i, orderedByDate);
      i += toSkip;

      const job = enter.job.id.toString();

      const pair: TimeEntryPair = {
        enterId: enter.id,
        enter: enter.when,
        job: enter.job.name,
        exit: new Date(0),
      };

      if (!pairsByJob[job]) {
        pairsByJob[job] = [];
      }

      if (!exit.isEmpty()) {
        pairsByJob[job].push({
          ...pair,
          exit: exit.when,
        });
      } else {
        pairsByJob[job].push({
          ...pair,
          exit: endOfDay(enter.when),
        });
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
      const date = getUnixTime(startOfDay(enter));

      const diff = Math.abs(enter.getTime() - exit.getTime());

      differencesByJobAndDate[job][date] = !!differencesByJobAndDate[job][date]
        ? differencesByJobAndDate[job][date] + diff
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

      if (!!difference) {
        humanDifferencesByJobAndDate[job][date] = humanDifference(
          new Date(0),
          new Date(difference),
        );
      } else {
        humanDifferencesByJobAndDate[job][date] = humanDifference(
          new Date(0),
          new Date(0),
        );
      }
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
    const nextTimeEntry = timeEntries[i];

    if (nextTimeEntry.type === TimeEntryTypes.OUT) {
      return [nextTimeEntry, toSkip];
    }
    toSkip++;
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

  const statistics: TimeStatisticTile[] = [];

  const maxDate = new Date(8640000000000000);

  const dateJobs = filter(
    job =>
      isWithinInterval(date, {
        start: job.start,
        end: !!job.end ? job.end : maxDate,
      }),
    profile.jobs,
  );

  const differencesByDate = getHumanDifferencesByRange(entries, {
    start: startOfDay(date),
    end: endOfDay(date),
  });

  console.log(differencesByDate);

  // const todayHoliday = filter(
  //   holiday =>
  //     isWithinInterval(date, {
  //       start: startOfDay(holiday.when),
  //       end: endOfDay(holiday.when),
  //     }),
  //   holidays,
  // );

  // const todayAbsences = filter(
  //   absence =>
  //     isWithinInterval(date, {
  //       start: absence.start,
  //       end: !!absence.end ? absence.end : maxDate,
  //     }),
  //   absences,
  // );

  for (const job of dateJobs) {
    // for (const project of dateProjects) {
    //   const workingHours = getDayWorkingHours(date, job);
    //   const projectWorkingHours = (workingHours * project.allocation) / 100;
    //   statistics.push({
    //     title: i18n._(
    //       /*i18n*/ {
    //         id: 'TimeStatistics.RemainingToday',
    //         values: { project: project.name },
    //       },
    //     ),
    //     subtitle: formatDate(date, language, 'MMMM dd'),
    //     text: `${projectWorkingHours}h`,
    //   });
    // }
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
