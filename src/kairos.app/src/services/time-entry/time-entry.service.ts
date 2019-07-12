import { TimeEntryModel, TimeEntryOutModel } from '../../models/time-entry.model';
import { mutation, query } from '../graphql.service';
import { createTimeEntryMutation } from './mutations/create-time-entry';
import { getTimeEntriesQuery } from './queries/get-time-entries';
import { map } from 'ramda';

export async function getTimeEntries() {
  const result = await query<{ timeEntries: TimeEntryOutModel[] }>(getTimeEntriesQuery);

  return map(out => TimeEntryModel.fromOutModel(out), result.timeEntries);
}

export async function createTimeEntry(model: TimeEntryModel) {
  await mutation(createTimeEntryMutation, { timeEntry: model });
}
