import { map } from 'ramda';
import {
  TimeAbsenceEntryModel,
  TimeAbsenceEntryOutModel,
} from '../../models/time-absence-entry.model';
import { UUID } from '../../models/uuid.model';
import { mutation, query } from '../graphql.service';
import { createTimeAbsenceEntriesMutation } from './mutations/create-time-absence-entries';
import { createTimeAbsenceEntryMutation } from './mutations/create-time-absence-entry';
import { deleteTimeAbsenceEntriesMutation } from './mutations/delete-time-absence-entries';
import { updateTimeAbsenceEntryMutation } from './mutations/update-time-absence-entry';
import { getTimeAbsenceEntriesQuery } from './queries/get-time-absence-entries';
import { getTimeAbsenceEntryQuery } from './queries/get-time-absence-entry';

export async function getTimeAbsenceEntry(id: UUID) {
  const result = await query<{ timeAbsenceEntry: TimeAbsenceEntryOutModel }>(
    getTimeAbsenceEntryQuery,
    {
      id,
    },
  );

  return TimeAbsenceEntryModel.fromOutModel(result.timeAbsenceEntry);
}

export async function getTimeAbsenceEntries(year: number) {
  const result = await query<{ timeAbsenceEntries: TimeAbsenceEntryOutModel[] }>(
    getTimeAbsenceEntriesQuery,
    { year },
  );

  return map(out => TimeAbsenceEntryModel.fromOutModel(out), result.timeAbsenceEntries);
}

export async function createTimeAbsenceEntry(model: TimeAbsenceEntryModel) {
  await mutation(createTimeAbsenceEntryMutation, { timeAbsenceEntry: model });
}

export async function deleteTimeAbsenceEntries(ids: UUID[]) {
  await mutation(deleteTimeAbsenceEntriesMutation, { ids: map(id => id.toString(), ids) });
}

export async function updateTimeAbsenceEntry(model: TimeAbsenceEntryModel) {
  await mutation(updateTimeAbsenceEntryMutation, { timeAbsenceEntry: model });
}

export async function bulkInsertTimeAbsenceEntries(models: TimeAbsenceEntryModel[]) {
  await mutation(createTimeAbsenceEntriesMutation, { timeAbsenceEntries: models });
}

export async function exportTimeAbsenceEntries(models: TimeAbsenceEntryModel[]) {
  await mutation(createTimeAbsenceEntriesMutation, { timeAbsenceEntries: models });
}
