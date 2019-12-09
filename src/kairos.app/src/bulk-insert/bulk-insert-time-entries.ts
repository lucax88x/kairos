import { t } from '@lingui/macro';
import produce from 'immer';
import { call, put, takeLatest } from 'redux-saga/effects';
import { createAsyncAction } from 'typesafe-actions';
import { BulkInsertActions } from '../actions';
import { i18n } from '../i18nLoader';
import { TimeEntryModel } from '../models/time-entry.model';
import { enqueueSnackbarAction } from '../notification-manager/actions';
import { bulkInsertTimeEntries } from '../services/time-entry/time-entry.service';
import {
  BULK_INSERT_TIME_ENTRIES,
  BULK_INSERT_TIME_ENTRIES_FAILURE,
  BULK_INSERT_TIME_ENTRIES_SUCCESS,
} from './constants';
import { BulkInsertState } from './state';

export const bulkInsertTimeEntriesAsync = createAsyncAction(
  BULK_INSERT_TIME_ENTRIES,
  BULK_INSERT_TIME_ENTRIES_SUCCESS,
  BULK_INSERT_TIME_ENTRIES_FAILURE,
)<{ models: TimeEntryModel[] }, void, string>();

function* doBulkTimeEntries({
  payload: { models },
}: ReturnType<typeof bulkInsertTimeEntriesAsync.request>) {
  try {
    yield call(bulkInsertTimeEntries, models);

    yield put(bulkInsertTimeEntriesAsync.success());
  } catch (error) {
    yield put(bulkInsertTimeEntriesAsync.failure(error.message));
  }
}

function* doNotifySuccess() {
  yield put(enqueueSnackbarAction(i18n._(t`Saved Entries`), { variant: 'success' }));
}

export function* bulkInsertTimeEntriesSaga() {
  yield takeLatest(BULK_INSERT_TIME_ENTRIES, doBulkTimeEntries);
  yield takeLatest(BULK_INSERT_TIME_ENTRIES_SUCCESS, doNotifySuccess);
}

export const bulkInsertTimeEntriesReducer = (
  state: BulkInsertState,
  action: BulkInsertActions,
): BulkInsertState =>
  produce(state, draft => {
    switch (action.type) {
      case BULK_INSERT_TIME_ENTRIES:
        draft.ui.busy.bulkTimeEntriesInsert = true;
        break;
      case BULK_INSERT_TIME_ENTRIES_SUCCESS:
        draft.ui.busy.bulkTimeEntriesInsert = false;
        break;
      case BULK_INSERT_TIME_ENTRIES_FAILURE:
        draft.ui.busy.bulkTimeEntriesInsert = false;
        break;
    }
  });
