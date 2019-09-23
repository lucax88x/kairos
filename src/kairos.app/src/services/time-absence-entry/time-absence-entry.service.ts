import { map } from 'ramda';
import {
  TimeAbsenceEntryModel,
  TimeAbsenceEntryOutModel,
} from '../../models/time-absence-entry.model';
import { UUID } from '../../models/uuid.model';
import { mutation, query } from '../graphql.service';
import { createTimeAbsenceEntriesMutation } from './mutations/create-time-absence-entries';
import { createTimeAbsenceEntryMutation } from './mutations/create-time-absence-entry';
import { deleteTimeAbsenceEntryMutation } from './mutations/delete-time-absence-entry';
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

export async function deleteTimeAbsenceEntry(id: UUID) {
  await mutation(deleteTimeAbsenceEntryMutation, { id: id.value });
}

export async function updateTimeAbsenceEntry(model: TimeAbsenceEntryModel) {
  await mutation(updateTimeAbsenceEntryMutation, { timeAbsenceEntry: model });
}

export async function bulkInsertTimeAbsenceEntries(models: TimeAbsenceEntryModel[]) {
  await mutation(createTimeAbsenceEntriesMutation, { timeAbsenceEntries: models });
}
