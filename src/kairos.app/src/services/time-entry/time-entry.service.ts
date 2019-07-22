import { map } from 'ramda';

import { TimeEntryModel, TimeEntryOutModel } from '../../models/time-entry.model';
import { UUID } from '../../models/uuid.model';
import { mutation, query } from '../graphql.service';
import { createTimeEntryMutation } from './mutations/create-time-entry';
import { deleteTimeEntryMutation } from './mutations/delete-time-entry';
import { updateTimeEntryMutation } from './mutations/update-time-entry';
import { getTimeEntriesQuery } from './queries/get-time-entries';
import { getTimeEntryQuery } from './queries/get-time-entry';

export async function getTimeEntry(id: UUID) {
  const result = await query<{ timeEntry: TimeEntryOutModel }>(getTimeEntryQuery, { id });

  return TimeEntryModel.fromOutModel(result.timeEntry);
}

export async function getTimeEntries() {
  const result = await query<{ timeEntries: TimeEntryOutModel[] }>(getTimeEntriesQuery);

  return map(out => TimeEntryModel.fromOutModel(out), result.timeEntries);
}

export async function createTimeEntry(model: TimeEntryModel) {
  await mutation(createTimeEntryMutation, { timeEntry: model });
}

export async function deleteTimeEntry(id: UUID) {
  await mutation(deleteTimeEntryMutation, { id: id.value });
}

export async function updateTimeEntry(model: TimeEntryModel) {
  await mutation(updateTimeEntryMutation, { timeEntry: model });
}
