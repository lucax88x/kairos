import { map } from 'ramda';
import {
  TimeAbsenceEntryModel,
  TimeAbsenceEntryOutModel,
} from '../../models/time-absence-entry.model';
import {
  TimeEntryListModel,
  TimeEntryListOutModel,
} from '../../models/time-entry-list.model';
import {
  TimeHolidayEntryModel,
  TimeHolidayEntryOutModel,
} from '../../models/time-holiday-entry.model';
import { query } from '../graphql.service';
import { getEntriesQuery } from './queries/get-entries';

export async function getEntries(start: Date, end: Date) {
  const result = await query<{
    timeEntries: TimeEntryListOutModel[];
    timeAbsenceEntries: TimeAbsenceEntryOutModel[];
    timeHolidayEntries: TimeHolidayEntryOutModel[];
  }>(getEntriesQuery, {
    start,
    end,
  });

  return [
    ...map(out => TimeEntryListModel.fromOutModel(out), result.timeEntries),
    ...map(
      out => TimeAbsenceEntryModel.fromOutModel(out),
      result.timeAbsenceEntries,
    ),
    ...map(
      out => TimeHolidayEntryModel.fromOutModel(out),
      result.timeHolidayEntries,
    ),
  ];
}
