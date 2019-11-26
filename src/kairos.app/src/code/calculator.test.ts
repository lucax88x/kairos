import { getUnixTime } from 'date-fns';
import { advanceTo, clear } from 'jest-date-mock';
import { TimeAbsenceEntryTypes } from '../models/time-absence-entry.model';
import { TimeEntryListModel } from '../models/time-entry-list.model';
import { TimeEntryTypes } from '../models/time-entry.model';
import { TimeHolidayEntryModel } from '../models/time-holiday-entry.model';
import { UUID } from '../models/uuid.model';
import { TimeAbsenceEntryBuilder } from '../tests/time-absence-entry.builder';
import { TimeEntryBuilder } from '../tests/time-entry.builder';
import { TimeHolidayEntryBuilder } from '../tests/time-holiday-entry.builder';
import { ProfileBuilder } from './../tests/profile.builder';
import {
  getHumanDifferencesByRange,
  getWorkingHoursStatistics,
} from './calculator';

describe('calculations', () => {
  it('should get differences with only 2 entries', () => {
    // given
    const jobId = UUID.Generate().toString();
    const start = new Date('January 1 2019 00:00');
    const end = new Date('January 31 2019 23:59');

    const timeEntries = [
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

    const timeEntries = [
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

    const timeEntries = [
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

    const timeEntries = [
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

  it('should get difference across different days', () => {
    // given
    const jobId = UUID.Generate().toString();
    const start = new Date('January 1 2019 00:00');
    const end = new Date('January 31 2019 23:59');

    const timeEntries = [
      buildTimeEntry(jobId, TimeEntryTypes.IN, 'January 1 2019 22:00'),
      buildTimeEntry(jobId, TimeEntryTypes.OUT, 'January 2 2019 02:00'),
    ];

    // when
    const result = getHumanDifferencesByRange(timeEntries, { start, end });

    // then
    expect(result[jobId][getUnixTime(new Date('January 1 2019'))]).toBe(
      '01:59',
    );
    expect(result[jobId][getUnixTime(new Date('January 2 2019'))]).toBe(
      '02:00',
    );
  });

  it('should not consider double IN', () => {
    // given
    const jobId = UUID.Generate().toString();
    const start = new Date('January 1 2019 00:00');
    const end = new Date('January 31 2019 23:59');

    const timeEntries = [
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

    const timeEntries = [
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

    const timeEntries = [
      buildTimeEntry(jobId, TimeEntryTypes.IN, 'January 1 2019 08:00'),
    ];

    // when
    const result = getHumanDifferencesByRange(timeEntries, { start, end });

    // then
    expect(result[jobId][getUnixTime(new Date('January 1 2019'))]).toBe(
      '15:59',
    );
  });

  it('should get correct max difference to now when date is today', () => {
    advanceTo(new Date('January 3 2019 15:00'));
    // given
    const jobId = UUID.Generate().toString();
    const start = new Date('January 1 2019 00:00');
    const end = new Date('January 31 2019 23:59');

    const timeEntries = [
      buildTimeEntry(jobId, TimeEntryTypes.IN, 'January 3 2019 08:00'),
    ];

    // when
    const result = getHumanDifferencesByRange(timeEntries, { start, end });

    // then
    expect(result[jobId][getUnixTime(new Date('January 3 2019'))]).toBe(
      '07:00',
    );
    clear();
  });

  it('should get max difference when there is no out even with next days', () => {
    // given
    const jobId = UUID.Generate().toString();
    const start = new Date('January 1 2019 00:00');
    const end = new Date('January 31 2019 23:59');

    const timeEntries = [
      buildTimeEntry(jobId, TimeEntryTypes.IN, 'January 1 2019 08:00'),
      buildTimeEntry(jobId, TimeEntryTypes.IN, 'January 2 2019 08:00'),
      buildTimeEntry(jobId, TimeEntryTypes.OUT, 'January 2 2019 17:00'),
    ];

    // when
    const result = getHumanDifferencesByRange(timeEntries, { start, end });

    // then
    expect(result[jobId][getUnixTime(new Date('January 1 2019'))]).toBe(
      '15:59',
    );
    expect(result[jobId][getUnixTime(new Date('January 2 2019'))]).toBe(
      '09:00',
    );
  });
});

describe('statistics', () => {
  it('build working hour statistics with a simple entry', () => {
    // given
    const jobId = UUID.Generate().toString();
    const profile = new ProfileBuilder().withJob(new UUID(jobId)).build();

    const timeEntries = [
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

    // then
    expect(result[0]).toEqual({
      title: 'TimeStatistics.RemainingToday',
      subtitle: 'January 01',
      text: '7.5h',
    });
  });

  it('build working hour statistics with a complete example', () => {
    // given
    const jobId = UUID.Generate().toString();
    const profile = new ProfileBuilder().withJob(new UUID(jobId)).build();

    const timeEntries = [
      buildTimeEntry(jobId, TimeEntryTypes.IN, 'January 1 2019 08:30'),
      buildTimeEntry(jobId, TimeEntryTypes.OUT, 'January 1 2019 12:30'),
      buildTimeEntry(jobId, TimeEntryTypes.IN, 'January 1 2019 13:30'),
      buildTimeEntry(jobId, TimeEntryTypes.OUT, 'January 1 2019 18:00'),
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

    // then
    expect(result[0]).toEqual({
      title: 'TimeStatistics.RemainingToday',
      subtitle: 'January 01',
      text: '0h',
    });
  });

  it('build working hour statistics with a overtimes', () => {
    // given
    const jobId = UUID.Generate().toString();
    const profile = new ProfileBuilder().withJob(new UUID(jobId)).build();

    const timeEntries = [
      buildTimeEntry(jobId, TimeEntryTypes.IN, 'January 1 2019 08:30'),
      buildTimeEntry(jobId, TimeEntryTypes.OUT, 'January 1 2019 12:30'),
      buildTimeEntry(jobId, TimeEntryTypes.IN, 'January 1 2019 13:30'),
      buildTimeEntry(jobId, TimeEntryTypes.OUT, 'January 1 2019 20:00'),
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

    // then
    expect(result[0]).toEqual({
      title: 'TimeStatistics.RemainingToday',
      subtitle: 'January 01',
      text: '-2h',
    });
  });

  it.only('build working hour statistics with multiple absences', () => {
    // given
    const jobId = UUID.Generate().toString();
    const profile = new ProfileBuilder().withJob(new UUID(jobId)).build();

    const timeEntries = [
      buildTimeEntry(jobId, TimeEntryTypes.IN, 'January 1 2019 08:30'),
      buildTimeEntry(jobId, TimeEntryTypes.OUT, 'January 1 2019 12:30'),
    ];
    
    const timeAbsenceEntries = [
      buildTimeAbsenceEntry('January 1 2019 13:00', 'January 1 2019 17:30'),
    ];

    // when
    const result = getWorkingHoursStatistics(
      new Date('January 1 2019 00:00'),
      'en',
      profile,
      timeEntries,
      timeAbsenceEntries,
      [],
    );

    // then
    expect(result[0]).toEqual({
      title: 'TimeStatistics.RemainingToday',
      subtitle: 'January 01',
      text: '0',
    });
  });

  it('build working hour statistics with a holiday', () => {
    // given
    const jobId = UUID.Generate().toString();
    const profile = new ProfileBuilder().withJob(new UUID(jobId)).build();

    const timeHolidayEntries = [buildTimeHolidayEntry('January 1 2019')];

    // when
    const result = getWorkingHoursStatistics(
      new Date('January 1 2019 00:00'),
      'en',
      profile,
      [],
      [],
      timeHolidayEntries,
    );

    // then
    expect(result[0]).toEqual({
      title: 'TimeStatistics.RemainingToday',
      subtitle: 'January 01',
      text: '0h',
    });
  });
});

function buildTimeEntry(jobId: string, type: TimeEntryTypes, date: string) {
  return new TimeEntryBuilder()
    .withJob(new UUID(jobId))
    .withType(type)
    .withDate(date)
    .build();
}

function buildTimeAbsenceEntry(
  start: string,
  end: string,
  type = TimeAbsenceEntryTypes.COMPENSATION,
) {
  return new TimeAbsenceEntryBuilder()
    .withType(type)
    .withStart(start)
    .withEnd(end)
    .build();
}

function buildTimeHolidayEntry(when: string) {
  return new TimeHolidayEntryBuilder().withWhen(when).build();
}
