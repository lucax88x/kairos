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
  isAfter,
  isFriday,
  isMonday,
  isSameDay,
  isSaturday,
  isSunday,
  isThursday,
  isTuesday,
  isWednesday,
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
  forEach,
  groupBy,
  map,
  sortWith,
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
import {
  filterByInterval,
  findAbsencesInDay,
  findAbsencesInRange,
  findHolidaysInDay,
  findHolidaysInRange,
  findJobsInRange,
} from './functions';
import { humanDifference, humanDifferenceFromHours } from './humanDifference';
import { sumDecimal } from './ramda.curried';

export interface TimeEntryPair {
  enterId: UUID;
  job: string;
  enter: Date;
  exit: Date;
}

const getDiffHoursFromAbsence = (
  job: JobModel,
  holidays: TimeHolidayEntryModel[],
) => (absence: TimeAbsenceEntryListModel): Decimal => {
  const days = eachDayOfInterval({ start: absence.start, end: absence.end });

  let hourDiff = new Decimal(0);
  for (const day of days) {
    const holidaysInDay = findHolidaysInDay(day)(holidays);
    if (!!holidaysInDay.length) {
      continue;
    }

    let dayHourDifference = new Decimal(0);

    const dayWorkingHours = getDayWorkingHours(day, job);
    if (compareAsc(day, absence.end) <= 0) {
      dayHourDifference = new Decimal(
        differenceInMinutes(absence.end, absence.start),
      ).div(60);

      // difference cannot be more than day working hours!
      if (dayHourDifference.greaterThan(dayWorkingHours)) {
        dayHourDifference = dayWorkingHours;
      }
    } else {
      dayHourDifference = dayHourDifference.plus(dayWorkingHours);
    }

    hourDiff = hourDiff.plus(dayHourDifference);
  }

  return hourDiff;
};

export const getDiffHoursFromAbsences = (
  job: JobModel,
  holidays: TimeHolidayEntryModel[],
) =>
  map<TimeAbsenceEntryListModel, Decimal>(
    getDiffHoursFromAbsence(job, holidays),
  );

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
        { roundToNearest15: true },
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

export interface TimeStatisticCell {
  title: string;
  titleValues: { [key: string]: string };
  subtitle?: string;
  text: string;
  details: DateDetails[];
}

export function getWorkingHoursStatistics(
  selectedYear: number,
  language: Language,
  profile: ProfileModel,
  entries: TimeEntryListModel[],
  absences: TimeAbsenceEntryListModel[],
  holidays: TimeHolidayEntryModel[],
) {
  const statistics: { [key: string]: TimeStatisticCell[] } = {
    RemainingToday: [],
    OvertimeToday: [],
    RemainingWeek: [],
    OvertimeWeek: [],
    PlusMinusWeek: [],
    RemainingYear: [],
    OvertimeYear: [],
    PlusMinusYear: [],
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

  let selectedYearDifferencesByDateByJob = currentYearDifferencesByDateByJob;

  if (isSelectedYearDifferent) {
    selectedYearDifferencesByDateByJob = getDifferencesByRangeByJobAndDate(
      entries,
      {
        start: selectedYearStart,
        end: selectedYearEnd,
      },
    );
  }

  let jobsInRange = findJobsInRange(
    currentYearStart,
    currentYearEnd,
  )(profile.jobs);

  if (isSelectedYearDifferent) {
    const selectedYearJobs = findJobsInRange(
      selectedYearStart,
      selectedYearEnd,
    )(profile.jobs);

    jobsInRange = unionWith(
      (j1, j2) => j1.id === j2.id,
      jobsInRange,
      selectedYearJobs,
    );
  }

  for (const job of jobsInRange) {
    const currentYearDifferencesByDate =
      currentYearDifferencesByDateByJob[job.id.toString()];

    const selectedYearDifferencesByDate =
      selectedYearDifferencesByDateByJob[job.id.toString()];

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
      subtitle: formatDate(now, language, 'MMMM dd yyyy'),
      text: humanDifferenceFromHours(
        todayJobHours.remainingHours,
        { roundToNearest15: false },
        averageWorkingHours,
      ),
      details: [],
    });

    statistics['OvertimeToday'].push({
      title: i18n._(t`Overtime Today: ${jobName}`),
      titleValues: { job: job.name },
      subtitle: formatDate(now, language, 'MMMM dd yyyy'),
      text: humanDifferenceFromHours(
        todayJobHours.overtimeHours,
        { roundToNearest15: false },
        averageWorkingHours,
      ),
      details: [],
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
        'MMMM dd yyyy',
      )} - ${formatDate(endOfWeek(now), language, 'MMMM dd yyyy')}`,
      text: humanDifferenceFromHours(
        weekJobHours.remainingHours,
        { roundToNearest15: false },
        averageWorkingHours,
      ),
      details: weekJobHours.details.remainingHours,
    });

    statistics['OvertimeWeek'].push({
      title: i18n._(t`Overtime Week: ${jobName}`),
      titleValues: { job: job.name },
      subtitle: `${formatDate(
        startOfWeek(now),
        language,
        'MMMM dd yyyy',
      )} - ${formatDate(endOfWeek(now), language, 'MMMM dd yyyy')}`,
      text: humanDifferenceFromHours(
        weekJobHours.overtimeHours,
        { roundToNearest15: false },
        averageWorkingHours,
      ),
      details: weekJobHours.details.overtimeHours,
    });

    statistics['PlusMinusWeek'].push({
      title: i18n._(t`PlusMinus Week: ${jobName}`),
      titleValues: { job: job.name },
      subtitle: `${formatDate(
        startOfWeek(now),
        language,
        'MMMM dd yyyy',
      )} - ${formatDate(endOfWeek(now), language, 'MMMM dd yyyy')}`,
      text: `${
        weekJobHours.plusMinusIsPositive ? '+' : '-'
      }${humanDifferenceFromHours(
        weekJobHours.plusMinusHours,
        { roundToNearest15: false },
        averageWorkingHours,
      )}`,
      details: [],
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

    statistics['RemainingYear'].push({
      title: i18n._(t`Remaining Year: ${jobName}`),
      titleValues: { job: job.name },
      subtitle: selectedYear.toString(),
      text: humanDifferenceFromHours(
        yearJobHours.remainingHours,
        { roundToNearest15: false },
        averageWorkingHours,
      ),
      details: yearJobHours.details.remainingHours,
    });

    statistics['OvertimeYear'].push({
      title: i18n._(t`Overtime Year: ${jobName}`),
      titleValues: { job: job.name },
      subtitle: selectedYear.toString(),
      text: humanDifferenceFromHours(
        yearJobHours.overtimeHours,
        { roundToNearest15: false },
        averageWorkingHours,
      ),
      details: yearJobHours.details.overtimeHours,
    });

    statistics['PlusMinusYear'].push({
      title: i18n._(t`PlusMinus Year: ${jobName}`),
      titleValues: { job: job.name },
      subtitle: selectedYear.toString(),
      text: `${
        yearJobHours.plusMinusIsPositive ? '+' : '-'
      }${humanDifferenceFromHours(
        yearJobHours.plusMinusHours,
        { roundToNearest15: false },
        averageWorkingHours,
      )}`,
      details: [],
    });
  }

  return statistics;
}

export function getAbsenceStatistics(
  selectedYear: number,
  language: Language,
  profile: ProfileModel,
  absences: TimeAbsenceEntryListModel[],
  holidays: TimeHolidayEntryModel[],
) {
  const statistics: { [key: string]: TimeStatisticCell[] } = {
    CompensationMonth: [],
    IllnessMonth: [],
    VacationMonth: [],
    PermitMonth: [],
    CompensationYear: [],
    IllnessYear: [],
    VacationYear: [],
    PermitYear: [],
    RemainingVacationYear: [],
  };

  const now = startOfDay(new Date());
  const currentYear = getYear(now);

  const isSelectedYearDifferent = currentYear !== selectedYear;

  const selectedYearDate = setYear(new Date(), selectedYear);

  const currentYearStart = startOfYear(now);
  const currentYearEnd = endOfYear(now);

  const selectedYearStart = startOfYear(selectedYearDate);
  const selectedYearEnd = endOfYear(selectedYearDate);

  const currentYearAbsencesInRange = findAbsencesInRange(
    currentYearStart,
    currentYearEnd,
  )(absences);

  const currentYearHolidaysInRange = findHolidaysInRange(
    currentYearStart,
    currentYearEnd,
  )(holidays);

  let selectedYearAbsencesInRange = currentYearAbsencesInRange;
  let selectedYearHolidaysInRange = currentYearHolidaysInRange;

  if (isSelectedYearDifferent) {
    selectedYearAbsencesInRange = findAbsencesInRange(
      selectedYearStart,
      selectedYearEnd,
    )(absences);

    selectedYearHolidaysInRange = findHolidaysInRange(
      selectedYearStart,
      selectedYearEnd,
    )(holidays);
  }

  let jobsInRange = findJobsInRange(
    currentYearStart,
    currentYearEnd,
  )(profile.jobs);

  if (isSelectedYearDifferent) {
    const selectedYearJobs = findJobsInRange(
      selectedYearStart,
      selectedYearEnd,
    )(profile.jobs);

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
      selectedYearAbsencesInRange,
    );

    const averageWorkingHours = JobModel.getAverageWorkingHours(job);
    const jobName = job.name;

    // month
    const monthAbsences = buildAbsencesForRange(
      startOfMonth(now),
      endOfMonth(now),
      job,
      currentYearJobAbsences,
      currentYearHolidaysInRange,
    );

    statistics['CompensationMonth'].push({
      title: i18n._(t`Compensation Month: ${jobName}`),
      titleValues: { job: job.name },
      subtitle: formatDate(now, language, 'MMMM yyyy'),
      text: humanDifferenceFromHours(
        monthAbsences.compensationHours,
        { roundToNearest15: false },
        averageWorkingHours,
      ),
      details: monthAbsences.details.compensationHours,
    });

    statistics['IllnessMonth'].push({
      title: i18n._(t`Illness Month: ${jobName}`),
      titleValues: { job: job.name },
      subtitle: formatDate(now, language, 'MMMM yyyy'),
      text: humanDifferenceFromHours(
        monthAbsences.illnessHours,
        { roundToNearest15: false },
        averageWorkingHours,
      ),
      details: monthAbsences.details.illnessHours,
    });

    statistics['VacationMonth'].push({
      title: i18n._(t`Vacation Month: ${jobName}`),
      titleValues: { job: job.name },
      subtitle: formatDate(now, language, 'MMMM yyyy'),
      text: humanDifferenceFromHours(
        monthAbsences.vacationHours,
        { roundToNearest15: false },
        averageWorkingHours,
      ),
      details: monthAbsences.details.vacationHours,
    });

    statistics['PermitMonth'].push({
      title: i18n._(t`Permit Month: ${jobName}`),
      titleValues: { job: job.name },
      subtitle: formatDate(now, language, 'MMMM yyyy'),
      text: humanDifferenceFromHours(
        monthAbsences.permitHours,
        { roundToNearest15: false },
        averageWorkingHours,
      ),
      details: monthAbsences.details.permitHours,
    });

    // year
    const selectedYearAbsences = buildAbsencesForRange(
      selectedYearStart,
      selectedYearEnd,
      job,
      selectedYearJobAbsences,
      selectedYearHolidaysInRange,
    );

    statistics['CompensationYear'].push({
      title: i18n._(t`Compensation Year: ${jobName}`),
      titleValues: { job: job.name },
      subtitle: selectedYear.toString(),
      text: humanDifferenceFromHours(
        selectedYearAbsences.compensationHours,
        { roundToNearest15: false },
        averageWorkingHours,
      ),
      details: selectedYearAbsences.details.compensationHours,
    });

    statistics['IllnessYear'].push({
      title: i18n._(t`Illness Year: ${jobName}`),
      titleValues: { job: job.name },
      subtitle: selectedYear.toString(),
      text: humanDifferenceFromHours(
        selectedYearAbsences.illnessHours,
        { roundToNearest15: false },
        averageWorkingHours,
      ),
      details: selectedYearAbsences.details.illnessHours,
    });

    statistics['VacationYear'].push({
      title: i18n._(t`Vacation Year: ${jobName}`),
      titleValues: { job: job.name },
      subtitle: selectedYear.toString(),
      text: humanDifferenceFromHours(
        selectedYearAbsences.vacationHours,
        { roundToNearest15: false },
        averageWorkingHours,
      ),
      details: selectedYearAbsences.details.vacationHours,
    });

    statistics['PermitYear'].push({
      title: i18n._(t`Permit Year: ${jobName}`),
      titleValues: { job: job.name },
      subtitle: selectedYear.toString(),
      text: humanDifferenceFromHours(
        selectedYearAbsences.permitHours,
        { roundToNearest15: false },
        averageWorkingHours,
      ),
      details: selectedYearAbsences.details.permitHours,
    });

    statistics['RemainingVacationYear'].push({
      title: i18n._(t`Remaining Vacation Year: ${jobName}`),
      titleValues: { job: job.name },
      subtitle: selectedYear.toString(),
      text: humanDifferenceFromHours(
        selectedYearAbsences.remainingVacationHours,
        { roundToNearest15: false },
        averageWorkingHours,
      ),
      details: [],
    });
  }
  return statistics;
}

function getDayWorkingHours(day: Date, job: JobModel): Decimal {
  if (isMonday(day)) {
    return new Decimal(job.monday);
  }
  if (isTuesday(day)) {
    return new Decimal(job.tuesday);
  }
  if (isWednesday(day)) {
    return new Decimal(job.wednesday);
  }
  if (isThursday(day)) {
    return new Decimal(job.thursday);
  }
  if (isFriday(day)) {
    return new Decimal(job.friday);
  }
  if (isSaturday(day)) {
    return new Decimal(job.saturday);
  }
  if (isSunday(day)) {
    return new Decimal(job.sunday);
  }
  return new Decimal(0);
}

function roundHours(hours: Decimal) {
  return hours
    .mul(100)
    .ceil()
    .div(100);
}

interface DateDetails {
  range: { start: Date; end: Date };
  hours: Decimal;
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
    plusMinusHours: Decimal;
    plusMinusIsPositive: boolean;
    details: {
      workedHours: DateDetails[];
      remainingHours: DateDetails[];
      overtimeHours: DateDetails[];
    };
  } = {
    workedHours: new Decimal(0),
    remainingHours: new Decimal(0),
    overtimeHours: new Decimal(0),
    plusMinusHours: new Decimal(0),
    plusMinusIsPositive: false,
    details: {
      workedHours: [],
      remainingHours: [],
      overtimeHours: [],
    },
  };

  const today = new Date();

  if (isAfter(end, today)) {
    end = today;
  }

  const days = eachDayOfInterval({ start, end });

  for (const day of days) {
    const absencesInDay = findAbsencesInDay(day)(absences);
    const holidaysInDay = findHolidaysInDay(day)(holidays);

    let remainingHours = new Decimal(0);
    let workedHours = new Decimal(0);
    let overtimeHours = new Decimal(0);
    if (holidaysInDay.length) {
      continue;
    }
    const workingHours = new Decimal(getDayWorkingHours(day, job));

    let absenceHours = new Decimal(
      sumDecimal(getDiffHoursFromAbsences(job, holidays)(absencesInDay)),
    );

    if (absenceHours.greaterThanOrEqualTo(workingHours)) {
      absenceHours = workingHours;
    }

    const difference = new Decimal(
      !!differencesByDate && !!differencesByDate[getUnixTime(day)]
        ? differencesByDate[getUnixTime(day)]
        : 0,
    );

    workedHours = unixToHours(difference);
    remainingHours = workingHours.minus(workedHours.plus(absenceHours));
    overtimeHours = remainingHours.lessThan(0)
      ? remainingHours.abs()
      : new Decimal(0);

    if (workedHours.greaterThan(0)) {
      results.workedHours = results.workedHours.plus(workedHours);
      results.details.workedHours.push({
        range: { start: day, end: day },
        hours: workedHours,
      });
    }
    if (remainingHours.greaterThan(0)) {
      results.remainingHours = results.remainingHours.plus(remainingHours);
      results.details.remainingHours.push({
        range: { start: day, end: day },
        hours: remainingHours,
      });
    }
    if (overtimeHours.greaterThan(0)) {
      results.overtimeHours = results.overtimeHours.plus(overtimeHours);
      results.details.overtimeHours.push({
        range: { start: day, end: day },
        hours: overtimeHours,
      });
    }
  }

  if (results.overtimeHours.greaterThan(results.remainingHours)) {
    results.plusMinusHours = results.overtimeHours.minus(
      results.remainingHours,
    );
    results.plusMinusIsPositive = true;
  } else {
    results.plusMinusHours = results.remainingHours.minus(
      results.overtimeHours,
    );
    results.plusMinusIsPositive = false;
  }

  return results;
}

function unixToHours(unix: Decimal): Decimal {
  return new Decimal(!!unix ? roundHours(unix.div(new Decimal(3600000))) : 0);
}

function buildAbsencesForRange(
  start: Date,
  end: Date,
  job: JobModel,
  absences: TimeAbsenceEntryListModel[],
  holidays: TimeHolidayEntryModel[],
) {
  const results: {
    compensationHours: Decimal;
    illnessHours: Decimal;
    vacationHours: Decimal;
    remainingVacationHours: Decimal;
    permitHours: Decimal;
    details: {
      compensationHours: DateDetails[];
      illnessHours: DateDetails[];
      vacationHours: DateDetails[];
      permitHours: DateDetails[];
    };
  } = {
    compensationHours: new Decimal(0),
    illnessHours: new Decimal(0),
    vacationHours: new Decimal(0),
    remainingVacationHours: new Decimal(0),
    permitHours: new Decimal(0),
    details: {
      compensationHours: [],
      illnessHours: [],
      vacationHours: [],
      permitHours: [],
    },
  };

  const absencesInDate = findAbsencesInRange(start, end)(absences);

  forEach(absence => {
    const diff = getDiffHoursFromAbsence(job, holidays)(absence);

    switch (absence.type) {
      case TimeAbsenceEntryTypes.ILLNESS: {
        results.illnessHours = results.illnessHours.plus(diff);
        results.details.illnessHours.push({
          range: { start: absence.start, end: absence.end },
          hours: diff,
        });
        break;
      }
      case TimeAbsenceEntryTypes.COMPENSATION: {
        results.compensationHours = results.compensationHours.plus(diff);
        results.details.compensationHours.push({
          range: { start: absence.start, end: absence.end },
          hours: diff,
        });
        break;
      }
      case TimeAbsenceEntryTypes.VACATION: {
        results.vacationHours = results.vacationHours.plus(diff);
        results.details.vacationHours.push({
          range: { start: absence.start, end: absence.end },
          hours: diff,
        });

        const averageWorkingHours = JobModel.getAverageWorkingHours(job);
        const holidaysPerYearHours = new Decimal(job.holidaysPerYear).mul(
          averageWorkingHours,
        );
        results.remainingVacationHours = holidaysPerYearHours.minus(
          results.vacationHours,
        );
        break;
      }
      case TimeAbsenceEntryTypes.PERMIT: {
        results.permitHours = results.permitHours.plus(diff);
        results.details.permitHours.push({
          range: { start: absence.start, end: absence.end },
          hours: diff,
        });
        break;
      }
    }
  }, absencesInDate);

  return results;
}
