import { map } from 'ramda';
import {
  TimeHolidayEntryModel,
  TimeHolidayEntryOutModel,
} from '../../models/time-holiday-entry.model';
import { UUID } from '../../models/uuid.model';
import { mutation, query } from '../graphql.service';
import { createTimeHolidayEntriesMutation } from './mutations/create-time-holiday-entries';
import { createTimeHolidayEntryMutation } from './mutations/create-time-holiday-entry';
import { deleteTimeHolidayEntriesMutation } from './mutations/delete-time-holiday-entries';
import { updateTimeHolidayEntriesByCountryMutation } from './mutations/update-time-holiday-entries-by-country';
import { updateTimeHolidayEntryMutation } from './mutations/update-time-holiday-entry';
import { getTimeHolidayEntriesQuery } from './queries/get-time-holiday-entries';
import { getTimeHolidayEntryQuery } from './queries/get-time-holiday-entry';

export async function getTimeHolidayEntry(id: UUID) {
  const result = await query<{ timeHolidayEntry: TimeHolidayEntryOutModel }>(
    getTimeHolidayEntryQuery,
    {
      id,
    },
  );

  return TimeHolidayEntryModel.fromOutModel(result.timeHolidayEntry);
}

export async function getTimeHolidayEntries(start: Date, end: Date) {
  const result = await query<{
    timeHolidayEntries: TimeHolidayEntryOutModel[];
  }>(getTimeHolidayEntriesQuery, { start, end });

  return map(
    out => TimeHolidayEntryModel.fromOutModel(out),
    result.timeHolidayEntries,
  );
}

export async function createTimeHolidayEntry(model: TimeHolidayEntryModel) {
  await mutation(createTimeHolidayEntryMutation, { timeHolidayEntry: model });
}

export async function deleteTimeHolidayEntries(ids: UUID[]) {
  await mutation(deleteTimeHolidayEntriesMutation, {
    ids: map(id => id.toString(), ids),
  });
}

export async function updateTimeHolidayEntry(model: TimeHolidayEntryModel) {
  await mutation(updateTimeHolidayEntryMutation, { timeHolidayEntry: model });
}

export async function updateTimeHolidayEntriesByCountry(
  year: number,
  countryCode: string,
) {
  await mutation(updateTimeHolidayEntriesByCountryMutation, {
    year,
    countryCode,
  });
}

export async function bulkInsertTimeHolidayEntries(
  models: TimeHolidayEntryModel[],
) {
  await mutation(createTimeHolidayEntriesMutation, {
    timeHolidayEntries: models,
  });
}
