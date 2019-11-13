import { getUnixTime } from 'date-fns';
import { TimeEntryListModel } from '../models/time-entry-list.model';
import { TimeEntryTypes } from '../models/time-entry.model';
import { UUID } from '../models/uuid.model';
import { TimeEntryBuilder } from '../tests/time-entry.builder';
import { ProfileBuilder } from './../tests/profile.builder';
import {
  getHumanDifferencesByRange,
  getWorkingHoursStatistics,
} from './calculator';

it('should get differences with only 2 entries', () => {
  // given
  const jobId = UUID.Generate().toString();
  const start = new Date('January 1 2019 00:00');
  const end = new Date('January 31 2019 23:59');

  const timeEntries: TimeEntryListModel[] = [
    buildTimeEntry(jobId, TimeEntryTypes.IN, 'January 1 2019 08:30'),
    buildTimeEntry(jobId, TimeEntryTypes.OUT, 'January 1 2019 09:30'),
  ];

  // when
  const result = getHumanDifferencesByRange(timeEntries, { start, end });

  // then
  expect(result[jobId][getUnixTime(new Date('January 1 2019'))]).toBe(
    '01:00',
  );
});

it('should get differences with only 2 entries even if not ordered', () => {
  // given
  const jobId = UUID.Generate().toString();
  const start = new Date('January 1 2019 00:00');
  const end = new Date('January 31 2019 23:59');

  const timeEntries: TimeEntryListModel[] = [
    buildTimeEntry(jobId, TimeEntryTypes.OUT, 'January 1 2019 09:30'),
    buildTimeEntry(jobId, TimeEntryTypes.IN, 'January 1 2019 08:30'),
  ];

  // when
  const result = getHumanDifferencesByRange(timeEntries, { start, end });

  // then
  expect(result[jobId][getUnixTime(new Date('January 1 2019'))]).toBe(
    '01:00',
  );
});

it('should get differences with 4 entries in the same day', () => {
  // given
  const jobId = UUID.Generate().toString();
  const start = new Date('January 1 2019 00:00');
  const end = new Date('January 31 2019 23:59');

  const timeEntries: TimeEntryListModel[] = [
    buildTimeEntry(jobId, TimeEntryTypes.IN, 'January 1 2019 08:00'),
    buildTimeEntry(jobId, TimeEntryTypes.OUT, 'January 1 2019 12:00'),
    buildTimeEntry(jobId, TimeEntryTypes.IN, 'January 1 2019 14:00'),
    buildTimeEntry(jobId, TimeEntryTypes.OUT, 'January 1 2019 18:00'),
  ];

  // when
  const result = getHumanDifferencesByRange(timeEntries, { start, end });

  // then
  expect(result[jobId][getUnixTime(new Date('January 1 2019'))]).toBe(
    '08:00',
  );
});

it('should get multiple differences with multiple days', () => {
  // given
  const jobId = UUID.Generate().toString();
  const start = new Date('January 1 2019 00:00');
  const end = new Date('January 31 2019 23:59');

  const timeEntries: TimeEntryListModel[] = [
    buildTimeEntry(jobId, TimeEntryTypes.IN, 'January 1 2019 08:00'),
    buildTimeEntry(jobId, TimeEntryTypes.OUT, 'January 1 2019 12:00'),
    buildTimeEntry(jobId, TimeEntryTypes.IN, 'January 4 2019 09:00'),
    buildTimeEntry(jobId, TimeEntryTypes.OUT, 'January 4 2019 09:10'),
  ];

  // when
  const result = getHumanDifferencesByRange(timeEntries, { start, end });

  // then
  expect(result[jobId][getUnixTime(new Date('January 1 2019'))]).toBe(
    '04:00',
  );
  expect(result[jobId][getUnixTime(new Date('January 4 2019'))]).toBe(
    '00:10',
  );
});

it('should not consider double IN', () => {
  // given
  const jobId = UUID.Generate().toString();
  const start = new Date('January 1 2019 00:00');
  const end = new Date('January 31 2019 23:59');

  const timeEntries: TimeEntryListModel[] = [
    buildTimeEntry(jobId, TimeEntryTypes.IN, 'January 1 2019 08:00'),
    buildTimeEntry(jobId, TimeEntryTypes.IN, 'January 1 2019 14:00'),
    buildTimeEntry(jobId, TimeEntryTypes.OUT, 'January 1 2019 18:00'),
  ];

  // when
  const result = getHumanDifferencesByRange(timeEntries, { start, end });

  // then
  expect(result[jobId][getUnixTime(new Date('January 1 2019'))]).toBe(
    '10:00',
  );
});

it('should not consider double OUT', () => {
  // given
  const jobId = UUID.Generate().toString();
  const start = new Date('January 1 2019 00:00');
  const end = new Date('January 31 2019 23:59');

  const timeEntries: TimeEntryListModel[] = [
    buildTimeEntry(jobId, TimeEntryTypes.IN, 'January 1 2019 08:00'),
    buildTimeEntry(jobId, TimeEntryTypes.OUT, 'January 1 2019 14:00'),
    buildTimeEntry(jobId, TimeEntryTypes.OUT, 'January 1 2019 18:00'),
  ];

  // when
  const result = getHumanDifferencesByRange(timeEntries, { start, end });

  // then
  expect(result[jobId][getUnixTime(new Date('January 1 2019'))]).toBe(
    '06:00',
  );
});

it('should get max difference when there is no out', () => {
  // given
  const jobId = UUID.Generate().toString();
  const start = new Date('January 1 2019 00:00');
  const end = new Date('January 31 2019 23:59');

  const timeEntries: TimeEntryListModel[] = [
    buildTimeEntry(jobId, TimeEntryTypes.IN, 'January 1 2019 08:00'),
  ];

  // when
  const result = getHumanDifferencesByRange(timeEntries, { start, end });

  // then
  expect(result[jobId][getUnixTime(new Date('January 1 2019'))]).toBe(
    '15:59',
  );
});

it('build working hour statistics', () => {
  // given
  const jobId = UUID.Generate().toString();
  const profile = new ProfileBuilder().build();

  const timeEntries: TimeEntryListModel[] = [
    buildTimeEntry(jobId, TimeEntryTypes.IN, 'January 1 2019 08:30'),
    buildTimeEntry(jobId, TimeEntryTypes.OUT, 'January 1 2019 09:30'),
  ];

  // when
  const result = getWorkingHoursStatistics(
    new Date('January 1 2019 00:00'),
    'en',
    profile,
    timeEntries,
    [],
    [],
  );
  console.log(result);

  // then
  expect(result[0]).toBe({
    title: 'TimeStatistics.RemainingToday',
    subtitle: 'January 01',
    text: '7h',
  });
});

function buildTimeEntry(jobId: string, type: TimeEntryTypes, date: string) {
  return new TimeEntryBuilder()
    .withJob(new UUID(jobId))
    .withType(type)
    .withDate(date)
    .build();
}
