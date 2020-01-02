import { i18n } from '@lingui/core';
import { t } from '@lingui/macro';
import {
  compareAsc,
  differenceInMinutes,
  eachDayOfInterval,
  endOfDay,
  endOfMonth,
  endOfWeek,
  endOfYear,
  format,
  getUnixTime,
  getYear,
  isFriday,
  isMonday,
  isSameDay,
  isSaturday,
  isSunday,
  isThursday,
  isTuesday,
  isWednesday,
  isWithinInterval,
  setYear,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
} from 'date-fns';
import { Decimal } from 'decimal.js';
import {
  ascend,
  filter,
  find,
  groupBy,
  map,
  reduce,
  sortWith,
  sum,
  unionWith,
} from 'ramda';
import { JobModel } from '../models/job.model';
import { Language } from '../models/language-model';
import { ProfileModel } from '../models/profile.model';
import { TimeAbsenceEntryListModel } from '../models/time-absence-entry-list.model';
import { TimeAbsenceEntryTypes } from '../models/time-absence-entry.model';
import { TimeEntryListModel } from '../models/time-entry-list.model';
import { TimeEntryTypes } from '../models/time-entry.model';
import { TimeHolidayEntryModel } from '../models/time-holiday-entry.model';
import { UUID } from '../models/uuid.model';
import { formatAsDate } from './constants';
import { formatDate } from './formatters';
import { filterByInterval } from './functions';
import { humanDifference, humanDifferenceFromHours } from './humanDifference';

export interface TimeEntryPair {
  enterId: UUID;
  job: string;
  enter: Date;
  exit: Date;
}

const getDiffHoursFromAbsence = (job: JobModel) => (
  absence: TimeAbsenceEntryListModel,
) => {
  const days = eachDayOfInterval({ start: absence.start, end: absence.end });

  let hourDiff = 0;
  for (const day of days) {
    let dayHourDifference = 0;
    const dayWorkingHours = getDayWorkingHours(day, job);
    if (compareAsc(day, absence.end) <= 0) {
      dayHourDifference = differenceInMinutes(absence.end, absence.start) / 60;

      // difference cannot be more than day working hours!
      if (dayHourDifference > dayWorkingHours) {
        dayHourDifference = dayWorkingHours;
      }
    } else {
      dayHourDifference += dayWorkingHours;
    }

    hourDiff += dayHourDifference;
  }

  return hourDiff;
};

export const getDiffHoursFromAbsences = (job: JobModel) =>
  map<TimeAbsenceEntryListModel, number>(getDiffHoursFromAbsence(job));

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

        if (!TimeEntryListModel.isEmpty(exit)) {
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
  titleValues: { [key: string]: string };
  subtitle?: string;
  text: string;
}

export function getWorkingHoursStatistics(
  selectedYear: number,
  language: Language,
  profile: ProfileModel,
  entries: TimeEntryListModel[],
  absences: TimeAbsenceEntryListModel[],
  holidays: TimeHolidayEntryModel[],
) {
  const statistics: { [key: string]: TimeStatisticTile[] } = {
    RemainingToday: [],
    OvertimeToday: [],
    RemainingWeek: [],
    OvertimeWeek: [],
    OvertimeYear: [],
  };

  const now = startOfDay(new Date());
  const currentYear = getYear(now);

  const isSelectedYearDifferent = currentYear !== selectedYear;

  const selectedYearDate = setYear(new Date(), selectedYear);

  const currentYearStart = startOfYear(now);
  const currentYearEnd = endOfYear(now);

  const selectedYearStart = startOfYear(selectedYearDate);
  const selectedYearEnd = endOfYear(selectedYearDate);

  const currentYearDifferencesByDateByJob = getDifferencesByRangeByJobAndDate(
    entries,
    {
      start: currentYearStart,
      end: currentYearEnd,
    },
  );

  let selectedYearDifferencesByDateByJob: {
    [id: string]: { [date: string]: number };
  } = {};

  if (isSelectedYearDifferent) {
    selectedYearDifferencesByDateByJob = getDifferencesByRangeByJobAndDate(
      entries,
      {
        start: selectedYearStart,
        end: selectedYearEnd,
      },
    );
  }

  let jobsInRange = filter(
    job =>
      compareAsc(job.start, currentYearStart) >= 0 && !!job.end
        ? compareAsc(job.end, currentYearEnd) <= 0
        : true,
    profile.jobs,
  );

  if (isSelectedYearDifferent) {
    const selectedYearJobs = filter(
      job =>
        compareAsc(job.start, selectedYearStart) >= 0 && !!job.end
          ? compareAsc(job.end, selectedYearEnd) <= 0
          : true,
      profile.jobs,
    );

    jobsInRange = unionWith(
      (j1, j2) => j1.id === j2.id,
      jobsInRange,
      selectedYearJobs,
    );
  }

  for (const job of jobsInRange) {
    const currentYearDifferencesByDate =
      currentYearDifferencesByDateByJob[job.id.toString()];

    const selectedYearDifferencesByDate = isSelectedYearDifferent
      ? selectedYearDifferencesByDateByJob[job.id.toString()]
      : currentYearDifferencesByDateByJob[job.id.toString()];

    const jobAbsences = filter(
      absence => UUID.equals(absence.job.id, job.id),
      absences,
    );

    const averageWorkingHours = JobModel.getAverageWorkingHours(job);
    const jobName = job.name;

    // today
    const todayJobHours = buildJobHoursForRange(
      startOfDay(now),
      endOfDay(now),
      job,
      currentYearDifferencesByDate,
      jobAbsences,
      holidays,
    );

    statistics['RemainingToday'].push({
      title: i18n._(t`Remaining Today: ${jobName}`),
      titleValues: { job: job.name },
      subtitle: formatDate(now, language, 'MMMM dd'),
      text: humanDifferenceFromHours(
        todayJobHours.remainingHours.toNumber(),
        averageWorkingHours,
      ),
    });

    statistics['OvertimeToday'].push({
      title: i18n._(t`Overtime Today: ${jobName}`),
      titleValues: { job: job.name },
      subtitle: formatDate(now, language, 'MMMM dd'),
      text: humanDifferenceFromHours(
        todayJobHours.overtimeHours.toNumber(),
        averageWorkingHours,
      ),
    });

    // week
    const weekJobHours = buildJobHoursForRange(
      startOfWeek(now),
      endOfWeek(now),
      job,
      currentYearDifferencesByDate,
      jobAbsences,
      holidays,
    );

    statistics['RemainingWeek'].push({
      title: i18n._(t`Remaining Week: ${jobName}`),
      titleValues: { job: job.name },
      subtitle: `${formatDate(
        startOfWeek(now),
        language,
        'MMMM dd',
      )} - ${formatDate(endOfWeek(now), language, 'MMMM dd')}`,
      text: humanDifferenceFromHours(
        weekJobHours.remainingHours.toNumber(),
        averageWorkingHours,
      ),
    });

    statistics['OvertimeWeek'].push({
      title: i18n._(t`Overtime Week: ${jobName}`),
      titleValues: { job: job.name },
      subtitle: `${formatDate(
        startOfWeek(now),
        language,
        'MMMM dd',
      )} - ${formatDate(endOfWeek(now), language, 'MMMM dd')}`,
      text: humanDifferenceFromHours(
        weekJobHours.overtimeHours.toNumber(),
        averageWorkingHours,
      ),
    });

    // year
    const yearJobHours = buildJobHoursForRange(
      selectedYearStart,
      selectedYearEnd,
      job,
      selectedYearDifferencesByDate,
      jobAbsences,
      holidays,
    );

    statistics['OvertimeYear'].push({
      title: i18n._(t`Overtime Year: ${jobName}`),
      titleValues: { job: job.name },
      subtitle: selectedYear.toString(),
      text: humanDifferenceFromHours(
        yearJobHours.overtimeHours.toNumber(),
        averageWorkingHours,
      ),
    });
  }

  return statistics;
}

export function getAbsenceStatistics(
  selectedYear: number,
  language: Language,
  profile: ProfileModel,
  absences: TimeAbsenceEntryListModel[],
) {
  const statistics: { [key: string]: TimeStatisticTile[] } = {
    CompensationMonth: [],
    IllnessMonth: [],
    VacationMonth: [],
    PermitMonth: [],
    CompensationYear: [],
    IllnessYear: [],
    VacationYear: [],
    PermitYear: [],
  };

  const now = startOfDay(new Date());
  const currentYear = getYear(now);

  const isSelectedYearDifferent = currentYear !== selectedYear;

  const selectedYearDate = setYear(new Date(), selectedYear);

  const currentYearStart = startOfYear(now);
  const currentYearEnd = endOfYear(now);

  const selectedYearStart = startOfYear(selectedYearDate);
  const selectedYearEnd = endOfYear(selectedYearDate);

  const currentYearAbsencesInRange = filter(
    absence =>
      compareAsc(absence.start, currentYearStart) >= 0 &&
      compareAsc(absence.end, currentYearEnd) <= 0,
    absences,
  );

  let selectedYearAbsencesInRange: TimeAbsenceEntryListModel[] = [];

  if (isSelectedYearDifferent) {
    selectedYearAbsencesInRange = filter(
      absence =>
        compareAsc(absence.start, selectedYearStart) >= 0 &&
        compareAsc(absence.end, selectedYearEnd) <= 0,
      absences,
    );
  }

  let jobsInRange = filter(
    job =>
      compareAsc(job.start, currentYearStart) >= 0 && !!job.end
        ? compareAsc(job.end, currentYearEnd) <= 0
        : true,
    profile.jobs,
  );

  if (isSelectedYearDifferent) {
    const selectedYearJobs = filter(
      job =>
        compareAsc(job.start, selectedYearStart) >= 0 && !!job.end
          ? compareAsc(job.end, selectedYearEnd) <= 0
          : true,
      profile.jobs,
    );

    jobsInRange = unionWith(
      (j1, j2) => j1.id === j2.id,
      jobsInRange,
      selectedYearJobs,
    );
  }

  for (const job of jobsInRange) {
    const currentYearJobAbsences = filter(
      absence => UUID.equals(absence.job.id, job.id),
      currentYearAbsencesInRange,
    );

    const selectedYearJobAbsences = filter(
      absence => UUID.equals(absence.job.id, job.id),
      isSelectedYearDifferent
        ? selectedYearAbsencesInRange
        : currentYearAbsencesInRange,
    );

    const averageWorkingHours = JobModel.getAverageWorkingHours(job);
    const jobName = job.name;

    // month
    const monthAbsences = buildAbsencesForRange(
      startOfMonth(now),
      endOfMonth(now),
      job,
      currentYearJobAbsences,
    );

    statistics['CompensationMonth'].push({
      title: i18n._(t`Compensation Month: ${jobName}`),
      titleValues: { job: job.name },
      subtitle: formatDate(now, language, 'MMMM'),
      text: humanDifferenceFromHours(
        monthAbsences.compensationHours.toNumber(),
        averageWorkingHours,
      ),
    });

    statistics['IllnessMonth'].push({
      title: i18n._(t`Illness Month: ${jobName}`),
      titleValues: { job: job.name },
      subtitle: formatDate(now, language, 'MMMM'),
      text: humanDifferenceFromHours(
        monthAbsences.illnessHours.toNumber(),
        averageWorkingHours,
      ),
    });

    statistics['VacationMonth'].push({
      title: i18n._(t`Vacation Month: ${jobName}`),
      titleValues: { job: job.name },
      subtitle: formatDate(now, language, 'MMMM'),
      text: humanDifferenceFromHours(
        monthAbsences.vacationHours.toNumber(),
        averageWorkingHours,
      ),
    });

    statistics['PermitMonth'].push({
      title: i18n._(t`Permit Month: ${jobName}`),
      titleValues: { job: job.name },
      subtitle: formatDate(now, language, 'MMMM'),
      text: humanDifferenceFromHours(
        monthAbsences.permitHours.toNumber(),
        averageWorkingHours,
      ),
    });

    // year
    const selectedYearAbsences = buildAbsencesForRange(
      selectedYearStart,
      selectedYearEnd,
      job,
      selectedYearJobAbsences,
    );

    statistics['CompensationYear'].push({
      title: i18n._(t`Compensation Year: ${jobName}`),
      titleValues: { job: job.name },
      subtitle: selectedYear.toString(),
      text: humanDifferenceFromHours(
        selectedYearAbsences.compensationHours.toNumber(),
        averageWorkingHours,
      ),
    });

    statistics['IllnessYear'].push({
      title: i18n._(t`Illness Year: ${jobName}`),
      titleValues: { job: job.name },
      subtitle: selectedYear.toString(),
      text: humanDifferenceFromHours(
        selectedYearAbsences.illnessHours.toNumber(),
        averageWorkingHours,
      ),
    });

    statistics['VacationYear'].push({
      title: i18n._(t`Vacation Year: ${jobName}`),
      titleValues: { job: job.name },
      subtitle: selectedYear.toString(),
      text: humanDifferenceFromHours(
        selectedYearAbsences.vacationHours.toNumber(),
        averageWorkingHours,
      ),
    });

    statistics['PermitYear'].push({
      title: i18n._(t`Permit Year: ${jobName}`),
      titleValues: { job: job.name },
      subtitle: selectedYear.toString(),
      text: humanDifferenceFromHours(
        selectedYearAbsences.permitHours.toNumber(),
        averageWorkingHours,
      ),
    });
  }
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

function roundHours(hours: number) {
  return new Decimal(hours)
    .mul(100)
    .ceil()
    .div(100);
}

function buildJobHoursForRange(
  start: Date,
  end: Date,
  job: JobModel,
  differencesByDate: { [date: number]: number },
  absences: TimeAbsenceEntryListModel[],
  holidays: TimeHolidayEntryModel[],
) {
  const results: {
    workedHours: Decimal;
    remainingHours: Decimal;
    overtimeHours: Decimal;
  } = {
    workedHours: new Decimal(0),
    remainingHours: new Decimal(0),
    overtimeHours: new Decimal(0),
  };

  const days = eachDayOfInterval({ start, end });

  for (const day of days) {
    const absencesInDate = filter(
      absence =>
        isWithinInterval(day, {
          start: startOfDay(absence.start),
          end: endOfDay(absence.end),
        }),
      absences,
    );

    const holidayInDate = find(
      holiday =>
        isWithinInterval(day, {
          start: startOfDay(holiday.when),
          end: endOfDay(holiday.when),
        }),
      holidays,
    );

    let remainingHours = new Decimal(0);
    let workedHours = new Decimal(0);
    let overtimeHours = new Decimal(0);
    if (!holidayInDate) {
      const absenceHours = sum(getDiffHoursFromAbsences(job)(absencesInDate));
      const difference = !!differencesByDate
        ? differencesByDate[getUnixTime(day)]
        : 0;
      const workingHours = new Decimal(getDayWorkingHours(day, job));
      workedHours = unixToHours(difference);

      remainingHours = workingHours.minus(workedHours.plus(absenceHours));
      overtimeHours = remainingHours.lessThan(0)
        ? remainingHours.abs()
        : new Decimal(0);
    }
    results.workedHours = results.workedHours.add(workedHours);
    results.remainingHours = results.remainingHours.add(remainingHours);
    results.overtimeHours = results.overtimeHours.add(overtimeHours);
  }
  return results;
}

function unixToHours(unix: number): Decimal {
  return new Decimal(!!unix ? roundHours(unix / 3600000) : 0);
}

function buildAbsencesForRange(
  start: Date,
  end: Date,
  job: JobModel,
  absences: TimeAbsenceEntryListModel[],
) {
  const results: {
    compensationHours: Decimal;
    illnessHours: Decimal;
    vacationHours: Decimal;
    permitHours: Decimal;
  } = {
    compensationHours: new Decimal(0),
    illnessHours: new Decimal(0),
    vacationHours: new Decimal(0),
    permitHours: new Decimal(0),
  };

  const absencesInDate = filter(
    absence =>
      compareAsc(absence.start, start) >= 0 &&
      compareAsc(absence.end, end) <= 0,
    absences,
  );

  const diffByTypes = reduce<
    TimeAbsenceEntryListModel,
    { [key: string]: number[] }
  >(
    (acc, absence) => {
      const diff = getDiffHoursFromAbsence(job)(absence);

      if (!acc[absence.type]) {
        acc[absence.type] = [];
      }

      acc[absence.type].push(diff);

      return acc;
    },

    {},
    absencesInDate,
  );

  if (!!diffByTypes[TimeAbsenceEntryTypes.COMPENSATION]) {
    results.compensationHours = new Decimal(
      sum(diffByTypes[TimeAbsenceEntryTypes.COMPENSATION]),
    );
  }

  if (!!diffByTypes[TimeAbsenceEntryTypes.ILLNESS]) {
    results.illnessHours = new Decimal(
      sum(diffByTypes[TimeAbsenceEntryTypes.ILLNESS]),
    );
  }

  if (!!diffByTypes[TimeAbsenceEntryTypes.VACATION]) {
    results.vacationHours = new Decimal(
      sum(diffByTypes[TimeAbsenceEntryTypes.VACATION]),
    );
  }

  if (!!diffByTypes[TimeAbsenceEntryTypes.PERMIT]) {
    results.permitHours = new Decimal(
      sum(diffByTypes[TimeAbsenceEntryTypes.PERMIT]),
    );
  }

  return results;
}
