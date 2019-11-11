import { ProfileBuilder } from './../tests/profile.builder';
import { TimeEntryModel, TimeEntryTypes } from '../models/time-entry.model';
import { UUID } from '../models/uuid.model';
import { getDifferencesByRangeByIdAndDate, getWorkingHoursStatistics } from './calculator';
import { TimeEntryListModel, TimeEntryListJobModel } from '../models/time-entry-list.model';
import { JobModel } from '../models/job.model';
import { ProfileModel } from '../models/profile.model';

it('should get differences with only 2 entries', () => {
  // given
  const start = new Date('January 1 2019 00:00');
  const end = new Date('January 31 2019 23:59');

  const timeEntries: TimeEntryListModel[] = [
    buildTimeEntry(TimeEntryTypes.IN, 'January 1 2019 08:30'),
    buildTimeEntry(TimeEntryTypes.OUT, 'January 1 2019 09:30'),
  ];

  // when
  const result = getDifferencesByRangeByIdAndDate(timeEntries, { start, end });

  // then
  expect(result[1]).toBe('01:00:00');
});

it('should get differences with only 2 entries even if not ordered', () => {
  // given
  const start = new Date('January 1 2019 00:00');
  const end = new Date('January 31 2019 23:59');

  const timeEntries: TimeEntryListModel[] = [
    buildTimeEntry(TimeEntryTypes.OUT, 'January 1 2019 09:30'),
    buildTimeEntry(TimeEntryTypes.IN, 'January 1 2019 08:30'),
  ];

  // when
  const result = getDifferencesByRangeByIdAndDate(timeEntries, { start, end });

  // then
  expect(result[1]).toBe('01:00:00');
});

it('should get differences with 4 entries in the same day', () => {
  // given
  const start = new Date('January 1 2019 00:00');
  const end = new Date('January 31 2019 23:59');

  const timeEntries: TimeEntryListModel[] = [
    buildTimeEntry(TimeEntryTypes.IN, 'January 1 2019 08:00'),
    buildTimeEntry(TimeEntryTypes.OUT, 'January 1 2019 12:00'),
    buildTimeEntry(TimeEntryTypes.IN, 'January 1 2019 14:00'),
    buildTimeEntry(TimeEntryTypes.OUT, 'January 1 2019 18:00'),
  ];

  // when
  const result = getDifferencesByRangeByIdAndDate(timeEntries, { start, end });

  // then
  expect(result[1]).toBe('08:00:00');
});

it('should get multiple differences with multiple days', () => {
  // given
  const start = new Date('January 1 2019 00:00');
  const end = new Date('January 31 2019 23:59');

  const timeEntries: TimeEntryListModel[] = [
    buildTimeEntry(TimeEntryTypes.IN, 'January 1 2019 08:00'),
    buildTimeEntry(TimeEntryTypes.OUT, 'January 1 2019 12:00'),
    buildTimeEntry(TimeEntryTypes.IN, 'January 4 2019 09:00'),
    buildTimeEntry(TimeEntryTypes.OUT, 'January 4 2019 09:10'),
  ];

  // when
  const result = getDifferencesByRangeByIdAndDate(timeEntries, { start, end });

  // then
  expect(result[1]).toBe('04:00:00');
  expect(result[4]).toBe('00:10:00');
});

it('should not consider double IN', () => {
  // given
  const start = new Date('January 1 2019 00:00');
  const end = new Date('January 31 2019 23:59');

  const timeEntries: TimeEntryListModel[] = [
    buildTimeEntry(TimeEntryTypes.IN, 'January 1 2019 08:00'),
    buildTimeEntry(TimeEntryTypes.IN, 'January 1 2019 14:00'),
    buildTimeEntry(TimeEntryTypes.OUT, 'January 1 2019 18:00'),
  ];

  // when
  const result = getDifferencesByRangeByIdAndDate(timeEntries, { start, end });

  // then
  expect(result[1]).toBe('10:00:00');
});

it('should not consider double OUT', () => {
  // given
  const start = new Date('January 1 2019 00:00');
  const end = new Date('January 31 2019 23:59');

  const timeEntries: TimeEntryListModel[] = [
    buildTimeEntry(TimeEntryTypes.IN, 'January 1 2019 08:00'),
    buildTimeEntry(TimeEntryTypes.OUT, 'January 1 2019 14:00'),
    buildTimeEntry(TimeEntryTypes.OUT, 'January 1 2019 18:00'),
  ];

  // when
  const result = getDifferencesByRangeByIdAndDate(timeEntries, { start, end });

  // then
  expect(result[1]).toBe('06:00:00');
});

it('should get max difference when there is no out', () => {
  // given
  const start = new Date('January 1 2019 00:00');
  const end = new Date('January 31 2019 23:59');

  const timeEntries: TimeEntryListModel[] = [
    buildTimeEntry(TimeEntryTypes.IN, 'January 1 2019 08:00'),
  ];

  // when
  const result = getDifferencesByRangeByIdAndDate(timeEntries, { start, end });

  // then
  expect(result[1]).toBe('23:59:59');
});

it('should get min difference when there is no in', () => {
  // given
  const start = new Date('January 1 2019 00:00');
  const end = new Date('January 31 2019 23:59');

  const timeEntries: TimeEntryListModel[] = [
    buildTimeEntry(TimeEntryTypes.OUT, 'January 1 2019 12:00'),
  ];

  // when
  const result = getDifferencesByRangeByIdAndDate(timeEntries, { start, end });

  // then
  expect(result[1]).toBe('00:00:00');
});

it('build working hour statistics', () => {
  // given
const profile = new ProfileBuilder().build()

  const timeEntries: TimeEntryListModel[] = [
    buildTimeEntry(TimeEntryTypes.IN, 'January 1 2019 08:30'),
    buildTimeEntry(TimeEntryTypes.OUT, 'January 1 2019 09:30'),
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

const buildTimeEntry = function(type: TimeEntryTypes, date: string) {
  return new TimeEntryListModel(
    UUID.Generate(),
    new Date(date),
    type,
    new TimeEntryListJobModel(''),
  );
};
