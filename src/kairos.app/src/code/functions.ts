import {
  compareAsc,
  endOfDay,
  getDate,
  isWithinInterval,
  startOfDay,
} from 'date-fns';
import { converge, divide, filter, groupBy, length, sum } from 'ramda';
import { JobModel } from '../models/job.model';
import { TimeAbsenceEntryListModel } from '../models/time-absence-entry-list.model';
import { TimeEntryListModel } from '../models/time-entry-list.model';
import { TimeHolidayEntryModel } from '../models/time-holiday-entry.model';

export const filterByInterval = (interval: Interval) =>
  filter((te: TimeEntryListModel) => isWithinInterval(te.when, interval));

export const groupByDate = groupBy((te: TimeEntryListModel) =>
  getDate(te.when).toString(),
);

export const maxDate = new Date(7289650740000);
export const minDate = new Date(0);

export const average = converge(divide, [sum, length]);

// remember that an absence can still span in multiple days!
export const findAbsencesInDay = (day: Date) =>
  filter<TimeAbsenceEntryListModel>(absence =>
    isWithinInterval(day, {
      start: startOfDay(absence.start),
      end: endOfDay(absence.end),
    }),
  );

export const findHolidaysInDay = (day: Date) =>
  filter<TimeHolidayEntryModel>(holiday =>
    isWithinInterval(day, {
      start: startOfDay(holiday.when),
      end: endOfDay(holiday.when),
    }),
  );

export const findAbsencesInRange = (start: Date, end: Date) =>
  filter<TimeAbsenceEntryListModel>(
    absence =>
      compareAsc(absence.start, start) >= 0 &&
      compareAsc(absence.end, end) <= 0,
  );

export const findHolidaysInRange = (start: Date, end: Date) =>
  filter<TimeHolidayEntryModel>(
    holiday =>
      compareAsc(holiday.when, start) >= 0 &&
      compareAsc(holiday.when, end) <= 0,
  );

export const findJobsInRange = (start: Date, end: Date) =>
  filter<JobModel>(job =>
    compareAsc(job.start, start) >= 0 && !!job.end
      ? compareAsc(job.end, end) <= 0
      : true,
  );
