import { TimeEntryModel, TimeEntryTypes } from '../models/time-entry.model';
import { UUID } from '../models/uuid.model';
import { getDifferencesByRange } from './calculator';

it('should get differences with only 2 entries', () => {
  // given
  const start = new Date('January 1 2019 00:00');
  const end = new Date('January 31 2019 23:59');

  const timeEntries: TimeEntryModel[] = [
    buildTimeEntry(TimeEntryTypes.IN, 'January 1 2019 08:30'),
    buildTimeEntry(TimeEntryTypes.OUT, 'January 1 2019 09:30'),
  ];

  // when
  const result = getDifferencesByRange(timeEntries, { start, end });

  // then
  expect(result['1']).toBe('01:00:00');
});

it('should get differences with only 2 entries even if not ordered', () => {
  // given
  const start = new Date('January 1 2019 00:00');
  const end = new Date('January 31 2019 23:59');

  const timeEntries: TimeEntryModel[] = [
    buildTimeEntry(TimeEntryTypes.OUT, 'January 1 2019 09:30'),
    buildTimeEntry(TimeEntryTypes.IN, 'January 1 2019 08:30'),
  ];

  // when
  const result = getDifferencesByRange(timeEntries, { start, end });

  // then
  expect(result['1']).toBe('01:00:00');
});

it('should get differences with 4 entries in the same day', () => {
  // given
  const start = new Date('January 1 2019 00:00');
  const end = new Date('January 31 2019 23:59');

  const timeEntries: TimeEntryModel[] = [
    buildTimeEntry(TimeEntryTypes.IN, 'January 1 2019 08:00'),
    buildTimeEntry(TimeEntryTypes.OUT, 'January 1 2019 12:00'),
    buildTimeEntry(TimeEntryTypes.IN, 'January 1 2019 14:00'),
    buildTimeEntry(TimeEntryTypes.OUT, 'January 1 2019 18:00'),
  ];

  // when
  const result = getDifferencesByRange(timeEntries, { start, end });

  // then
  expect(result['1']).toBe('08:00:00');
});

it('should get multiple differences with multiple days', () => {
  // given
  const start = new Date('January 1 2019 00:00');
  const end = new Date('January 31 2019 23:59');

  const timeEntries: TimeEntryModel[] = [
    buildTimeEntry(TimeEntryTypes.IN, 'January 1 2019 08:00'),
    buildTimeEntry(TimeEntryTypes.OUT, 'January 1 2019 12:00'),
    buildTimeEntry(TimeEntryTypes.IN, 'January 4 2019 09:00'),
    buildTimeEntry(TimeEntryTypes.OUT, 'January 4 2019 09:10'),
  ];

  // when
  const result = getDifferencesByRange(timeEntries, { start, end });

  // then
  expect(result['1']).toBe('04:00:00');
  expect(result['4']).toBe('00:10:00');
});

it('should not consider double IN', () => {
  // given
  const start = new Date('January 1 2019 00:00');
  const end = new Date('January 31 2019 23:59');

  const timeEntries: TimeEntryModel[] = [
    buildTimeEntry(TimeEntryTypes.IN, 'January 1 2019 08:00'),
    buildTimeEntry(TimeEntryTypes.IN, 'January 1 2019 14:00'),
    buildTimeEntry(TimeEntryTypes.OUT, 'January 1 2019 18:00'),
  ];

  // when
  const result = getDifferencesByRange(timeEntries, { start, end });

  // then
  expect(result['1']).toBe('10:00:00');
});

it('should not consider double OUT', () => {
  // given
  const start = new Date('January 1 2019 00:00');
  const end = new Date('January 31 2019 23:59');

  const timeEntries: TimeEntryModel[] = [
    buildTimeEntry(TimeEntryTypes.IN, 'January 1 2019 08:00'),
    buildTimeEntry(TimeEntryTypes.OUT, 'January 1 2019 14:00'),
    buildTimeEntry(TimeEntryTypes.OUT, 'January 1 2019 18:00'),
  ];

  // when
  const result = getDifferencesByRange(timeEntries, { start, end });

  // then
  expect(result['1']).toBe('06:00:00');
});

it('should get max difference when there is no out', () => {
  // given
  const start = new Date('January 1 2019 00:00');
  const end = new Date('January 31 2019 23:59');

  const timeEntries: TimeEntryModel[] = [buildTimeEntry(TimeEntryTypes.IN, 'January 1 2019 08:00')];

  // when
  const result = getDifferencesByRange(timeEntries, { start, end });

  // then
  expect(result['1']).toBe('23:59:59');
});

it('should get min difference when there is no in', () => {
  // given
  const start = new Date('January 1 2019 00:00');
  const end = new Date('January 31 2019 23:59');

  const timeEntries: TimeEntryModel[] = [
    buildTimeEntry(TimeEntryTypes.OUT, 'January 1 2019 12:00'),
  ];

  // when
  const result = getDifferencesByRange(timeEntries, { start, end });

  // then
  expect(result['1']).toBe('00:00:00');
});

const buildTimeEntry = function(type: TimeEntryTypes, date: string) {
  return new TimeEntryModel(UUID.Generate(), new Date(date), type);
};
