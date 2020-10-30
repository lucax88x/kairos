import { getUnixTime } from 'date-fns';
import { TimeEntryTypes } from '../models/time-entry.model';
import { UUID } from '../models/uuid.model';
import { buildTimeEntry } from '../tests/test.helper';
import { ProfileBuilder } from './../tests/profile.builder';
import { getAverageWorkingHoursByDay } from './chart';

describe('chart', () => {
  it('should get differences with only 2 entries', () => {
    // given
    const jobId = UUID.Generate().toString();
    const profile = new ProfileBuilder().withJob(new UUID(jobId)).build();

    const timeEntries = [
      buildTimeEntry(jobId, TimeEntryTypes.IN, 'January 1 2019 08:30'),
      buildTimeEntry(jobId, TimeEntryTypes.OUT, 'January 1 2019 09:30'),
    ];

    // when
    const result = getAverageWorkingHoursByDay(2019, profile, timeEntries);

    // then
    // expect(result[jobId][getUnixTime(new Date('January 1 2019'))]).toBe(
    //   '01:00',
    // );
  });
});
