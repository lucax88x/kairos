import { map } from 'ramda';

import {
  TimeHolidayEntryModel,
  TimeHolidayEntryOutModel,
} from '../../models/time-holiday-entry.model';
import { UUID } from '../../models/uuid.model';
import { mutation, query } from '../graphql.service';
import { createTimeHolidayEntryMutation } from './mutations/create-time-holiday-entry';
import { deleteTimeHolidayEntryMutation } from './mutations/delete-time-holiday-entry';
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

export async function getTimeHolidayEntries() {
  const result = await query<{ timeHolidayEntries: TimeHolidayEntryOutModel[] }>(
    getTimeHolidayEntriesQuery,
  );

  return map(out => TimeHolidayEntryModel.fromOutModel(out), result.timeHolidayEntries);
}

export async function createTimeHolidayEntry(model: TimeHolidayEntryModel) {
  await mutation(createTimeHolidayEntryMutation, { timeHolidayEntry: model });
}

export async function deleteTimeHolidayEntry(id: UUID) {
  await mutation(deleteTimeHolidayEntryMutation, { id: id.value });
}

export async function updateTimeHolidayEntry(model: TimeHolidayEntryModel) {
  await mutation(updateTimeHolidayEntryMutation, { timeHolidayEntry: model });
}
