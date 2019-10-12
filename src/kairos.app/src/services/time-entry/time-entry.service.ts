import { map } from 'ramda';

import { TimeEntryModel, TimeEntryOutModel } from '../../models/time-entry.model';
import { UUID } from '../../models/uuid.model';
import { mutation, query } from '../graphql.service';
import { createTimeEntriesMutation } from './mutations/create-time-entries';
import { createTimeEntryMutation } from './mutations/create-time-entry';
import { deleteTimeEntriesMutation } from './mutations/delete-time-entries';
import { updateTimeEntryMutation } from './mutations/update-time-entry';
import { getTimeEntriesQuery } from './queries/get-time-entries';
import { getTimeEntryQuery } from './queries/get-time-entry';
import { TimeEntryListModel, TimeEntryListOutModel } from '../../models/time-entry-list.model';

export async function getTimeEntry(id: UUID) {
  const result = await query<{ timeEntry: TimeEntryOutModel }>(getTimeEntryQuery, { id });

  return TimeEntryModel.fromOutModel(result.timeEntry);
}

export async function getTimeEntries(year: number) {
  const result = await query<{ timeEntries: TimeEntryListOutModel[] }>(getTimeEntriesQuery, {
    year,
  });

  return map(out => TimeEntryListModel.fromOutModel(out), result.timeEntries);
}

export async function createTimeEntry(model: TimeEntryModel) {
  await mutation(createTimeEntryMutation, { timeEntry: model });
}

export async function deleteTimeEntries(ids: UUID[]) {
  await mutation(deleteTimeEntriesMutation, { ids: map(id => id.toString(), ids) });
}

export async function updateTimeEntry(model: TimeEntryModel) {
  await mutation(updateTimeEntryMutation, { timeEntry: model });
}

export async function bulkInsertTimeEntries(models: TimeEntryModel[]) {
  await mutation(createTimeEntriesMutation, { timeEntries: models });
}

export async function exportTimeEntries(start: Date, end: Date) {
  await mutation(createTimeEntriesMutation, { start, end });
}
