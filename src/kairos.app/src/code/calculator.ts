// import {
//   eachDayOfInterval,
//   endOfDay,
//   format,
//   getDate,
//   isFriday,
//   isMonday,
//   isSaturday,
//   isSunday,
//   isThursday,
//   isTuesday,
//   isWednesday,
//   isWithinInterval,
//   startOfDay,
// } from 'date-fns';
// import { ascend, filter, sortWith, flatten } from 'ramda';
// import { i18n } from '../i18nLoader';
// import { JobModel } from '../models/job.model';
// import { Language } from '../models/language-model';
// import { ProfileModel } from '../models/profile.model';
// import { TimeAbsenceEntryModel } from '../models/time-absence-entry.model';
// import { TimeEntryListModel } from '../models/time-entry-list.model';
// import { TimeEntryTypes } from '../models/time-entry.model';
// import { TimeHolidayEntryModel } from '../models/time-holiday-entry.model';
// import { UUID } from '../models/uuid.model';
// import { formatAsDate } from './constants';
// import { formatDate } from './formatters';
// import { filterByInterval, humanDifference } from './functions';

// export interface TimeEntryPair {
//   enterId: UUID;
//   job: string;
//   project: string;
//   enter: Date;
//   exit: Date;
// }

// export function getTimeEntryPairsById(
//   timeEntries: TimeEntryListModel[],
//   interval: Interval,
// ): { [id: string]: TimeEntryPair[] } {
//   const filteredByInterval = filterByInterval(interval)(timeEntries);
//   const orderedByDate = sortWith([ascend(te => te.when)], filteredByInterval);
//   const pairsById: { [id: string]: TimeEntryPair[] } = {};

//   for (let i = 0; i < orderedByDate.length; i++) {
//     const enter = orderedByDate[i];

//     if (enter.type === TimeEntryTypes.IN) {
//       const [exit, toSkip] = getNearestExit(i, orderedByDate);
//       i += toSkip;

//       const id = `${enter.job.id}_${enter.project.id}`;
//       const pair = {
//         enterId: enter.id,
//         enter: enter.when,
//         job: enter.job.name,
//         project: enter.project.name,
//       };

//       if (!pairsById[id]) {
//         pairsById[id] = [];
//       }

//       if (!exit.isEmpty()) {
//         pairsById[id].push({
//           ...pair,
//           exit: exit.when,
//         });
//       } else {
//         pairsById[id].push({
//           ...pair,
//           exit: endOfDay(enter.when),
//         });
//       }
//     }
//   }
//   return pairsById;
// }

// export function getDifferencesByRangeByIdAndDate(timeEntries: TimeEntryListModel[], interval: Interval) {
//   const pairsById = getTimeEntryPairsById(timeEntries, interval);

//   const differencesByIdAndDate: { [id: string]: { [date: number]: number } } = {};

//   for (const id in pairsById) {
//     const pairs = pairsById[id];

//     if (!differencesByIdAndDate[id]) {
//       differencesByIdAndDate[id] = {};
//     }

//     for (const { enter, exit } of pairs) {
//       const date = getDate(enter);

//       const diff = Math.abs(enter.getTime() - exit.getTime());

//       differencesByIdAndDate[id][date] = !!differencesByIdAndDate[date]
//         ? differencesByIdAndDate[id][date] + diff
//         : diff;
//     }
//   }

//   return differencesByIdAndDate;
// }

// export function getHumanDifferencesByRange(timeEntries: TimeEntryListModel[], interval: Interval) {
//   const differencesByIdAndDate = getDifferencesByRangeByIdAndDate(timeEntries, interval);

//   for(const id in differencesByIdAndDate){
//     for(const date in differencesByIdAndDate[id]){
//       const difference = differencesByIdAndDate[id][date];
//     }
//   }


//   const days = eachDayOfInterval(interval);

//   const result: { [date: string]: string } = {};
//   for (let i = 0; i < days.length; i++) {
//     const day = days[i];
//     const date = getDate(day);
//     const key = format(day, formatAsDate);

//     if (!!differencesByDate[date]) {
//       result[key] = humanDifference(new Date(0), new Date(differencesByDate[date]));
//     } else {
//       result[key] = humanDifference(new Date(0), new Date(0));
//     }
//   }
//   return result;
// }

// function getNearestExit(
//   startingIndex: number,
//   timeEntries: TimeEntryListModel[],
// ): [TimeEntryListModel, number] {
//   let toSkip = 0;
//   for (let i = startingIndex + 1; i < timeEntries.length; i++) {
//     const nextTimeEntry = timeEntries[i];

//     if (nextTimeEntry.type === TimeEntryTypes.OUT) {
//       return [nextTimeEntry, toSkip];
//     }
//     toSkip++;
//   }
//   return [TimeEntryListModel.empty, toSkip];
// }

// export interface TimeStatisticTile {
//   title: string;
//   subtitle?: string;
//   text: string;
// }

// export function getWorkingHoursStatistics(
//   date: Date,
//   language: Language,
//   profile: ProfileModel,
//   entries: TimeEntryListModel[],
//   absences: TimeAbsenceEntryModel[],
//   holidays: TimeHolidayEntryModel[],
// ): TimeStatisticTile[] {
//   //# { title: 'remaining today', subtitle: 'Monday, 16', text: '8h' },
//   // { title: 'remaining this week', subtitle: '12 -> 19', text: '30' },
//   // { title: 'remaining this month', subtitle: 'August', text: '30' },
//   // { title: 'done today', subtitle: 'July', text: '8h' },
//   // { title: 'done this week', subtitle: 'July', text: '30' },
//   // { title: 'done this month', subtitle: 'August', text: '50' },
//   // { title: 'done previous month', subtitle: 'July', text: '30' },
//   // { title: 'done all previous months', text: '30' },
//   // { title: 'done this year', subtitle: '2019', text: '250' },
//   // { title: 'done previous year', subtitle: '2018', text: '30' },
//   // { title: 'done all previous years', text: '30' },

//   const statistics: TimeStatisticTile[] = [];

//   const maxDate = new Date(8640000000000000);

//   const dateJobs = filter(
//     job =>
//       isWithinInterval(date, {
//         start: job.start,
//         end: !!job.end ? job.end : maxDate,
//       }),
//     profile.jobs,
//   );

//   const differencesByDate = getHumanDifferencesByRange(entries, {
//     start: startOfDay(date),
//     end: endOfDay(date),
//   });

//   console.log(differencesByDate);

//   // const todayHoliday = filter(
//   //   holiday =>
//   //     isWithinInterval(date, {
//   //       start: startOfDay(holiday.when),
//   //       end: endOfDay(holiday.when),
//   //     }),
//   //   holidays,
//   // );

//   // const todayAbsences = filter(
//   //   absence =>
//   //     isWithinInterval(date, {
//   //       start: absence.start,
//   //       end: !!absence.end ? absence.end : maxDate,
//   //     }),
//   //   absences,
//   // );

//   for (const job of dateJobs) {
//     const dateProjects = filter(
//       project =>
//         isWithinInterval(date, {
//           start: project.start,
//           end: !!project.end ? project.end : maxDate,
//         }),
//       job.projects,
//     );

//     for (const project of dateProjects) {
//       const workingHours = getDayWorkingHours(date, job);
//       const projectWorkingHours = (workingHours * project.allocation) / 100;

//       statistics.push({
//         title: i18n._(
//           /*i18n*/ {
//             id: 'TimeStatistics.RemainingToday',
//             values: { project: project.name },
//           },
//         ),
//         subtitle: formatDate(date, language, 'MMMM dd'),
//         text: `${projectWorkingHours}h`,
//       });
//     }
//   }

//   return statistics;
// }

// export function getVacationStatistics(
//   language: Language,
//   absences: TimeAbsenceEntryModel[],
// ): TimeStatisticTile[] {
//   // { title: 'remaining this year', subtitle: '2019', text: '0' },
//   // { title: 'done this year', subtitle: '2019', text: '30' },
//   // { title: 'remaining previous years', text: '30' },

//   const statistics: TimeStatisticTile[] = [];

//   return statistics;
// }

// export function getIllnessStatistics(
//   language: Language,
//   absences: TimeAbsenceEntryModel[],
// ): TimeStatisticTile[] {
//   // { title: 'done this year', subtitle: '2019', text: '5d' }

//   const statistics: TimeStatisticTile[] = [];

//   return statistics;
// }

// function getDayWorkingHours(day: Date, job: JobModel): number {
//   if (isMonday(day)) {
//     return job.monday;
//   }
//   if (isTuesday(day)) {
//     return job.tuesday;
//   }
//   if (isWednesday(day)) {
//     return job.wednesday;
//   }
//   if (isThursday(day)) {
//     return job.thursday;
//   }
//   if (isFriday(day)) {
//     return job.friday;
//   }
//   if (isSaturday(day)) {
//     return job.saturday;
//   }
//   if (isSunday(day)) {
//     return job.sunday;
//   }
//   return 0;
// }

import {
  eachDayOfInterval,
  endOfDay,
  format,
  getDate,
  isFriday,
  isMonday,
  isSaturday,
  isSunday,
  isThursday,
  isTuesday,
  isWednesday,
  isWithinInterval,
} from 'date-fns';
import { ascend, filter, sortWith } from 'ramda';
import { i18n } from '../i18nLoader';
import { JobModel } from '../models/job.model';
import { ProfileModel } from '../models/profile.model';
import { TimeAbsenceEntryModel } from '../models/time-absence-entry.model';
import { TimeEntryListModel } from '../models/time-entry-list.model';
import { TimeEntryTypes } from '../models/time-entry.model';
import { TimeHolidayEntryModel } from '../models/time-holiday-entry.model';
import { UUID } from '../models/uuid.model';
import { filterByInterval, humanDifference } from './functions';
import { Language } from '../models/language-model';
import { formatDate } from './formatters';

export interface CalendarEvent {
  enter: Date;
  exit: Date;
  title: string;
  id: UUID;
}

export function getEnterExitEvents(timeEntries: TimeEntryListModel[], interval: Interval) {
  const filteredByInterval = filterByInterval(interval)(timeEntries);
  const orderedByDate = sortWith([ascend(te => te.when)], filteredByInterval);
  const events: CalendarEvent[] = [];

  for (let i = 0; i < orderedByDate.length; i++) {
    const enter = orderedByDate[i];

    if (enter.type === TimeEntryTypes.IN) {
      const [exit, toSkip] = getNearestExit(i, orderedByDate);
      i += toSkip;

      const title = `${enter.job.name} - ${enter.project.name}`;

      if (!exit.isEmpty()) {
        events.push({ enter: enter.when, exit: exit.when, title, id: enter.id });
      } else {
        events.push({ enter: enter.when, exit: endOfDay(enter.when), title, id: enter.id });
      }
    }
  }
  return events;
}

export function getDifferencesByRange(timeEntries: TimeEntryListModel[], interval: Interval) {
  const pairs = getEnterExitEvents(timeEntries, interval);

  const differencesByDate: { [date: number]: number } = {};

  for (const { enter, exit } of pairs) {
    const date = getDate(enter);

    const diff = Math.abs(enter.getTime() - exit.getTime());

    differencesByDate[date] = !!differencesByDate[date] ? differencesByDate[date] + diff : diff;
  }

  const days = eachDayOfInterval(interval);

  const result: { [date: number]: string } = {};
  for (let i = 0; i < days.length; i++) {
    const date = getDate(days[i]);

    if (!!differencesByDate[date]) {
      result[date] = humanDifference(new Date(0), new Date(differencesByDate[date]));
    } else {
      result[date] = humanDifference(new Date(0), new Date(0));
    }
  }
  return result;
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

  const today = new Date();
  const maxDate = new Date(8640000000000000);

  const todayJobs = filter(
    job =>
      isWithinInterval(today, {
        start: job.start,
        end: !!job.end ? job.end : maxDate,
      }),
    profile.jobs,
  );

  for (const job of todayJobs) {
    const todayProjects = filter(
      project =>
        isWithinInterval(today, {
          start: project.start,
          end: !!project.end ? project.end : maxDate,
        }),
      job.projects,
    );

    for (const project of todayProjects) {
      const workingHours = getDayWorkingHours(today, job);
      const projectWorkingHours = (workingHours * project.allocation) / 100;

      statistics.push({
        title: i18n._(
          /*i18n*/ {
            id: 'TimeStatistics.RemainingToday',
            values: { project: project.name },
          },
        ),
        subtitle: formatDate(today, language, 'MMMM MM'),
        text: `${projectWorkingHours}h`,
      });
    }
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
