import { getUnixTime } from 'date-fns';
import { advanceTo, clear } from 'jest-date-mock';
import {
  TimeAbsenceEntryTypes,
  TimeAbsenceEntryOutModel,
} from '../models/time-absence-entry.model';
import { TimeEntryTypes } from '../models/time-entry.model';
import { UUID } from '../models/uuid.model';
import { TimeAbsenceEntryBuilder } from '../tests/time-absence-entry.builder';
import { TimeEntryBuilder } from '../tests/time-entry.builder';
import { TimeHolidayEntryBuilder } from '../tests/time-holiday-entry.builder';
import { ProfileBuilder } from './../tests/profile.builder';
import {
  getAbsenceStatistics,
  getHumanDifferencesByRange,
  getWorkingHoursStatistics,
  getDiffHoursFromAbsences,
} from './calculator';
import { JobModel } from '../models/job.model';

import absenceStatisticScenario1 from '../data/absence-statistic-scenario-1.json';
import {
  TimeAbsenceEntryListModel,
  TimeAbsenceEntryListOutModel,
} from '../models/time-absence-entry-list.model';
import { map } from 'ramda';

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
      '00:15',
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
      '02:00',
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
      '16:00',
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
      '16:00',
    );
    expect(result[jobId][getUnixTime(new Date('January 2 2019'))]).toBe(
      '09:00',
    );
  });
});

describe('statistics', () => {
  const jobId = UUID.Generate().toString();
  const profile = new ProfileBuilder().withJob(new UUID(jobId)).build();

  beforeEach(() => {
    advanceTo(new Date('January 1 2019 15:00'));
  });
  afterEach(() => {
    clear();
  });

  describe('working hours', () => {
    describe('single day', () => {
      it('build working hour statistics with a simple entry', () => {
        // given
        const timeEntries = [
          buildTimeEntry(jobId, TimeEntryTypes.IN, 'January 1 2019 08:30'),
          buildTimeEntry(jobId, TimeEntryTypes.OUT, 'January 1 2019 09:30'),
        ];

        // when
        const result = getWorkingHoursStatistics(
          2019,
          'en',
          profile,
          timeEntries,
          [],
          [],
        );

        // then
        expect(result['RemainingToday'][0]).toEqual(
          expect.objectContaining({
            subtitle: 'January 01',
            text: '07:30',
          }),
        );

        expect(result['OvertimeToday'][0]).toEqual(
          expect.objectContaining({
            subtitle: 'January 01',
            text: '-',
          }),
        );
      });

      it('build working hour statistics with a complete example', () => {
        // given
        const timeEntries = [
          buildTimeEntry(jobId, TimeEntryTypes.IN, 'January 1 2019 08:30'),
          buildTimeEntry(jobId, TimeEntryTypes.OUT, 'January 1 2019 12:30'),
          buildTimeEntry(jobId, TimeEntryTypes.IN, 'January 1 2019 13:30'),
          buildTimeEntry(jobId, TimeEntryTypes.OUT, 'January 1 2019 18:00'),
        ];

        // when
        const result = getWorkingHoursStatistics(
          2019,
          'en',
          profile,
          timeEntries,
          [],
          [],
        );

        // then
        expect(result['RemainingToday'][0]).toEqual(
          expect.objectContaining({
            subtitle: 'January 01',
            text: '-',
          }),
        );

        expect(result['OvertimeToday'][0]).toEqual(
          expect.objectContaining({
            subtitle: 'January 01',
            text: '-',
          }),
        );
      });

      it('build working hour statistics with a overtimes', () => {
        // given
        const timeEntries = [
          buildTimeEntry(jobId, TimeEntryTypes.IN, 'January 1 2019 08:30'),
          buildTimeEntry(jobId, TimeEntryTypes.OUT, 'January 1 2019 12:30'),
          buildTimeEntry(jobId, TimeEntryTypes.IN, 'January 1 2019 13:30'),
          buildTimeEntry(jobId, TimeEntryTypes.OUT, 'January 1 2019 20:00'),
        ];

        // when
        const result = getWorkingHoursStatistics(
          2019,
          'en',
          profile,
          timeEntries,
          [],
          [],
        );

        // then
        expect(result['RemainingToday'][0]).toEqual(
          expect.objectContaining({
            subtitle: 'January 01',
            text: '-2:00',
          }),
        );

        expect(result['OvertimeToday'][0]).toEqual(
          expect.objectContaining({
            subtitle: 'January 01',
            text: '02:00',
          }),
        );
      });

      it('build working hour statistics with multiple absences', () => {
        // given
        const timeEntries = [
          buildTimeEntry(jobId, TimeEntryTypes.IN, 'January 1 2019 08:30'),
          buildTimeEntry(jobId, TimeEntryTypes.OUT, 'January 1 2019 12:30'),
        ];

        const timeAbsenceEntries = [
          buildTimeAbsenceEntry(
            jobId,
            'January 1 2019 13:00',
            'January 1 2019 17:30',
          ),
        ];

        // when
        const result = getWorkingHoursStatistics(
          2019,
          'en',
          profile,
          timeEntries,
          timeAbsenceEntries,
          [],
        );

        // then
        expect(result['RemainingToday'][0]).toEqual(
          expect.objectContaining({
            subtitle: 'January 01',
            text: '-',
          }),
        );

        expect(result['OvertimeToday'][0]).toEqual(
          expect.objectContaining({
            subtitle: 'January 01',
            text: '-',
          }),
        );
      });

      it('build working hour statistics with a holiday', () => {
        // given
        const timeHolidayEntries = [buildTimeHolidayEntry('January 1 2019')];

        // when
        const result = getWorkingHoursStatistics(
          2019,
          'en',
          profile,
          [],
          [],
          timeHolidayEntries,
        );

        // then
        expect(result['RemainingToday'][0]).toEqual(
          expect.objectContaining({
            subtitle: 'January 01',
            text: '-',
          }),
        );

        expect(result['OvertimeToday'][0]).toEqual(
          expect.objectContaining({
            subtitle: 'January 01',
            text: '-',
          }),
        );
      });
    });

    describe('complete-week', () => {
      it('build working hour statistics with a complete example', () => {
        // given
        const timeEntries = [
          buildTimeEntry(jobId, TimeEntryTypes.IN, 'January 1 2019 08:30'),
          buildTimeEntry(jobId, TimeEntryTypes.OUT, 'January 1 2019 18:00'),
          buildTimeEntry(jobId, TimeEntryTypes.IN, 'January 2 2019 08:30'),
          buildTimeEntry(jobId, TimeEntryTypes.OUT, 'January 2 2019 16:00'),
        ];

        // when
        const result = getWorkingHoursStatistics(
          2019,
          'en',
          profile,
          timeEntries,
          [],
          [],
        );

        // then
        expect(result['RemainingWeek'][0]).toEqual(
          expect.objectContaining({
            subtitle: 'December 30 - January 05',
            text: '03wd',
          }),
        );
      });
    });

    it('should not go overflow with forgotten entries', () => {
      advanceTo(new Date('January 3 2019 15:00'));

      // given
      const timeEntries = [
        buildTimeEntry(jobId, TimeEntryTypes.IN, 'January 1 2019 08:30'),
      ];

      // when
      const result = getWorkingHoursStatistics(
        2019,
        'en',
        profile,
        timeEntries,
        [],
        [],
      );

      // then
      expect(result['RemainingToday'][0]).toEqual(
        expect.objectContaining({
          subtitle: 'January 03',
          text: '01wd',
        }),
      );

      expect(result['OvertimeToday'][0]).toEqual(
        expect.objectContaining({
          subtitle: 'January 03',
          text: '-',
        }),
      );

      clear();
    });

    it('absence should not last more than working hours', () => {
      // given
      const timeEntries = [
        buildTimeEntry(jobId, TimeEntryTypes.IN, 'January 1 2019 08:30'),
        buildTimeEntry(jobId, TimeEntryTypes.OUT, 'January 1 2019 08:30'),
      ];

      const timeAbsenceEntries = [
        buildTimeAbsenceEntry(
          jobId,
          'January 1 2019 00:00',
          'January 1 2019 23:59',
          TimeAbsenceEntryTypes.COMPENSATION,
        ),
      ];

      // when
      const result = getWorkingHoursStatistics(
        2019,
        'en',
        profile,
        timeEntries,
        timeAbsenceEntries,
        [],
      );

      // then
      expect(result['RemainingToday'][0]).toEqual(
        expect.objectContaining({
          subtitle: 'January 01',
          text: '-',
        }),
      );

      expect(result['OvertimeToday'][0]).toEqual(
        expect.objectContaining({
          subtitle: 'January 01',
          text: '-',
        }),
      );
    });

    it('get current year overtimes', () => {
      // given
      const timeEntries = [
        buildTimeEntry(jobId, TimeEntryTypes.IN, 'January 1 2019 06:00'),
        buildTimeEntry(jobId, TimeEntryTypes.OUT, 'January 1 2019 20:00'),
        buildTimeEntry(jobId, TimeEntryTypes.IN, 'January 2 2019 06:00'),
        buildTimeEntry(jobId, TimeEntryTypes.OUT, 'January 2 2019 20:00'),
        buildTimeEntry(jobId, TimeEntryTypes.IN, 'January 3 2019 06:00'),
        buildTimeEntry(jobId, TimeEntryTypes.OUT, 'January 3 2019 20:00'),
        buildTimeEntry(jobId, TimeEntryTypes.IN, 'January 4 2019 06:00'),
        buildTimeEntry(jobId, TimeEntryTypes.OUT, 'January 4 2019 20:00'),
        buildTimeEntry(jobId, TimeEntryTypes.IN, 'January 5 2019 06:00'),
        buildTimeEntry(jobId, TimeEntryTypes.OUT, 'January 5 2019 20:00'),
        buildTimeEntry(jobId, TimeEntryTypes.IN, 'January 6 2019 06:00'),
        buildTimeEntry(jobId, TimeEntryTypes.OUT, 'January 6 2019 20:00'),
        buildTimeEntry(jobId, TimeEntryTypes.IN, 'January 7 2019 06:00'),
        buildTimeEntry(jobId, TimeEntryTypes.OUT, 'January 7 2019 20:00'),
        buildTimeEntry(jobId, TimeEntryTypes.IN, 'January 8 2019 06:00'),
        buildTimeEntry(jobId, TimeEntryTypes.OUT, 'January 8 2019 20:00'),
      ];

      // when
      const result = getWorkingHoursStatistics(
        2019,
        'en',
        profile,
        timeEntries,
        [],
        [],
      );

      // then
      expect(result['OvertimeYear'][0]).toEqual(
        expect.objectContaining({
          subtitle: '2019',
          text: '07wd 01:30',
        }),
      );
    });
  });

  describe('absences', () => {
    it('build absence statistics', () => {
      // given
      const timeAbsenceEntries = [
        buildTimeAbsenceEntry(
          jobId,
          'January 1 2019 15:00',
          'January 1 2019 18:00',
          TimeAbsenceEntryTypes.COMPENSATION,
        ),
        buildTimeAbsenceEntry(
          jobId,
          'January 1 2019 09:00',
          'January 1 2019 12:00',
          TimeAbsenceEntryTypes.ILLNESS,
        ),
        buildTimeAbsenceEntry(
          jobId,
          'January 1 2019 08:00',
          'January 1 2019 09:00',
          TimeAbsenceEntryTypes.VACATION,
        ),
        buildTimeAbsenceEntry(
          jobId,
          'January 1 2019 18:00',
          'January 1 2019 21:00',
          TimeAbsenceEntryTypes.PERMIT,
        ),
        buildTimeAbsenceEntry(
          jobId,
          'January 1 2019 20:00',
          'January 1 2019 21:30',
          TimeAbsenceEntryTypes.COMPENSATION,
        ),
      ];

      // when
      const result = getAbsenceStatistics(
        2019,
        'en',
        profile,
        timeAbsenceEntries,
      );

      // then
      expect(result['CompensationMonth'][0]).toEqual(
        expect.objectContaining({
          subtitle: 'January',
          text: '04:30',
        }),
      );
      expect(result['IllnessMonth'][0]).toEqual(
        expect.objectContaining({
          subtitle: 'January',
          text: '03:00',
        }),
      );
      expect(result['VacationMonth'][0]).toEqual(
        expect.objectContaining({
          subtitle: 'January',
          text: '01:00',
        }),
      );
      expect(result['PermitMonth'][0]).toEqual(
        expect.objectContaining({
          subtitle: 'January',
          text: '03:00',
        }),
      );
    });
  });
});

describe('real world scenarios', () => {
  const jobId = 'd975e9f7-6255-4e6d-b1e6-0c04e60fa574';
  const profile = new ProfileBuilder().withJob(new UUID(jobId)).build();

  it('scenario 1', () => {
    // given
    const timeAbsenceEntriesJson = absenceStatisticScenario1 as TimeAbsenceEntryListOutModel[];

    const timeAbsenceEntries = map(
      j => TimeAbsenceEntryListModel.fromOutModel(j),
      timeAbsenceEntriesJson,
    );

    // when
    const result = getAbsenceStatistics(
      2019,
      'en',
      profile,
      timeAbsenceEntries,
    );

    // then
    expect(result['CompensationYear'][0]).toEqual(
      expect.objectContaining({
        subtitle: '2019',
        text: '4wd 01:00',
      }),
    );
  });
});

describe('getHoursFromAbsences', () => {
  const jobId = UUID.Generate().toString();
  const job = new JobModel(
    new UUID(jobId),
    'job',
    new Date(0),
    new Date(8640000000000000),
    20,
    5,
    6,
    7,
    8,
    9,
    0,
    0,
  );

  it(`should get normal hour differences when they don't exceed job times`, () => {
    // given
    const timeAbsenceEntries = [
      buildTimeAbsenceEntry(
        jobId,
        'January 1 2019 13:00',
        'January 1 2019 17:00',
        TimeAbsenceEntryTypes.COMPENSATION,
      ),
    ];

    // when
    const hours = getDiffHoursFromAbsences(job)(timeAbsenceEntries);

    // then
    expect(hours).toEqual([4]);
  });

  it(`should get reduced hour differences when they exceed job times`, () => {
    // given
    const timeAbsenceEntries = [
      buildTimeAbsenceEntry(
        jobId,
        'January 1 2019 00:00',
        'January 1 2019 23:59',
        TimeAbsenceEntryTypes.COMPENSATION,
      ),
    ];

    // when
    const hours = getDiffHoursFromAbsences(job)(timeAbsenceEntries);

    // then
    expect(hours).toEqual([6]);
  });

  it(`should get reduced hour differences when they exceed job times for each day`, () => {
    // given
    const timeAbsenceEntries = [
      buildTimeAbsenceEntry(
        jobId,
        'January 1 2019 00:00',
        'January 3 2019 23:59',
        TimeAbsenceEntryTypes.COMPENSATION,
      ),
    ];

    // when
    const hours = getDiffHoursFromAbsences(job)(timeAbsenceEntries);

    // then
    expect(hours).toEqual([21]);
  });

  it.only(`should get reduced hour differences with different time zones`, () => {
    // given
    const timeAbsenceEntries = [
      buildTimeAbsenceEntry(
        jobId,
        '2019-12-05T00:00:00.000Z',
        '2019-12-05T23:59:00.000Z',
        TimeAbsenceEntryTypes.COMPENSATION,
      ),
    ];

    // when
    const hours = getDiffHoursFromAbsences(job)(timeAbsenceEntries);

    // then
    expect(hours).toEqual([8]);
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

function buildTimeHolidayEntry(when: string) {
  return new TimeHolidayEntryBuilder().withWhen(when).build();
}
