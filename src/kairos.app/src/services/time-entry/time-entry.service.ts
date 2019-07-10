import { mutation, query } from '../graphql.service';
import { createTimeEntryMutation } from './mutations/create-time-entry';
import { getTimeEntriesQuery } from './queries/get-time-entries';
import { TimeEntryInputModel } from '../../models/time-entry.model';

export async function getTimeEntries() {
  await query(getTimeEntriesQuery);
}

export async function createTimeEntry(model: TimeEntryInputModel) {
  await mutation(createTimeEntryMutation, { timeEntry: model });
}
