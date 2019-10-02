import { t } from '@lingui/macro';
import produce from 'immer';
import { call, put, takeLatest } from 'redux-saga/effects';
import { createAsyncAction } from 'typesafe-actions';
import { BulkInsertActions } from '../actions';
import { i18n } from '../i18nLoader';
import { TimeAbsenceEntryModel } from '../models/time-absence-entry.model';
import { enqueueSnackbarAction } from '../notification-manager/actions';
import { bulkInsertTimeAbsenceEntries } from '../services/time-absence-entry/time-absence-entry.service';
import { BULK_INSERT_TIME_ABSENCE_ENTRIES, BULK_INSERT_TIME_ABSENCE_ENTRIES_FAILURE, BULK_INSERT_TIME_ABSENCE_ENTRIES_SUCCESS } from './constants';
import { BulkInsertState } from './state';

export const bulkInsertTimeAbsenceEntriesAsync = createAsyncAction(
  BULK_INSERT_TIME_ABSENCE_ENTRIES,
  BULK_INSERT_TIME_ABSENCE_ENTRIES_SUCCESS,
  BULK_INSERT_TIME_ABSENCE_ENTRIES_FAILURE,
)<{ models: TimeAbsenceEntryModel[] }, void, string>();

function* doBulkTimeAbsenceEntries({
  payload: { models },
}: ReturnType<typeof bulkInsertTimeAbsenceEntriesAsync.request>) {
  try {
    yield call(bulkInsertTimeAbsenceEntries, models);

    yield put(bulkInsertTimeAbsenceEntriesAsync.success());
  } catch (error) {
    yield put(bulkInsertTimeAbsenceEntriesAsync.failure(error.message));
  }
}

function* doNotifySuccess() {
  yield put(enqueueSnackbarAction(i18n._(t`Messages.BulkAbsencesSaved`), { variant: 'success' }));
}

export function* bulkInsertTimeAbsenceEntriesSaga() {
  yield takeLatest(BULK_INSERT_TIME_ABSENCE_ENTRIES, doBulkTimeAbsenceEntries);
  yield takeLatest(BULK_INSERT_TIME_ABSENCE_ENTRIES_SUCCESS, doNotifySuccess);
}

export const bulkInsertTimeAbsenceEntriesReducer = (
  state: BulkInsertState,
  action: BulkInsertActions,
): BulkInsertState =>
  produce(state, draft => {
    switch (action.type) {
      case BULK_INSERT_TIME_ABSENCE_ENTRIES:
        draft.ui.busy.bulkTimeAbsenceEntriesInsert = true;
        break;
      case BULK_INSERT_TIME_ABSENCE_ENTRIES_SUCCESS:
        draft.ui.busy.bulkTimeAbsenceEntriesInsert = false;
        break;
      case BULK_INSERT_TIME_ABSENCE_ENTRIES_FAILURE:
        draft.ui.busy.bulkTimeAbsenceEntriesInsert = false;
        break;
    }
  });
