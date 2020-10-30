import { TimeAbsenceEntryTypes } from '../models/time-absence-entry.model';
import { TimeEntryTypes } from '../models/time-entry.model';
import { UUID } from '../models/uuid.model';
import { TimeAbsenceEntryBuilder } from './time-absence-entry.builder';
import { TimeEntryBuilder } from './time-entry.builder';
import { TimeHolidayEntryBuilder } from './time-holiday-entry.builder';

export function buildTimeEntry(
  jobId: string,
  type: TimeEntryTypes,
  date: string,
) {
  return new TimeEntryBuilder()
    .withJob(new UUID(jobId))
    .withType(type)
    .withDate(date)
    .build();
}

export function buildTimeAbsenceEntry(
  jobId: string,
  start: string,
  end: string,
  type = TimeAbsenceEntryTypes.COMPENSATION,
) {
  return new TimeAbsenceEntryBuilder()
    .withJob(new UUID(jobId))
    .withType(type)
    .withStart(start)
    .withEnd(end)
    .build();
}

export function buildTimeHolidayEntry(when: string) {
  return new TimeHolidayEntryBuilder().withWhen(when).build();
}
