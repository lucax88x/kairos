import produce from 'immer';
import { call, put, takeLatest } from 'redux-saga/effects';
import { createAsyncAction } from 'typesafe-actions';
import { BulkInsertActions } from '../actions';
import { TimeHolidayEntryModel } from '../models/time-holiday-entry.model';
import { enqueueSnackbarAction } from '../notification-manager/actions';
import { bulkInsertTimeHolidayEntries } from '../services/time-holiday-entry/time-holiday-entry.service';
import {
  BULK_INSERT_TIME_HOLIDAY_ENTRIES,
  BULK_INSERT_TIME_HOLIDAY_ENTRIES_FAILURE,
  BULK_INSERT_TIME_HOLIDAY_ENTRIES_SUCCESS,
} from './constants';
import { BulkInsertState } from './state';

export const bulkInsertTimeHolidayEntriesAsync = createAsyncAction(
  BULK_INSERT_TIME_HOLIDAY_ENTRIES,
  BULK_INSERT_TIME_HOLIDAY_ENTRIES_SUCCESS,
  BULK_INSERT_TIME_HOLIDAY_ENTRIES_FAILURE,
)<{ models: TimeHolidayEntryModel[] }, void, string>();

function* doBulkTimeHolidayEntries({
  payload: { models },
}: ReturnType<typeof bulkInsertTimeHolidayEntriesAsync.request>) {
  try {
    yield call(bulkInsertTimeHolidayEntries, models);

    yield put(bulkInsertTimeHolidayEntriesAsync.success());
  } catch (error) {
    yield put(bulkInsertTimeHolidayEntriesAsync.failure(error.message));
  }
}

function* doNotifySuccess() {
  yield put(enqueueSnackbarAction('Holidays saved!', { variant: 'success' }));
}

export function* bulkInsertTimeHolidayEntriesSaga() {
  yield takeLatest(BULK_INSERT_TIME_HOLIDAY_ENTRIES, doBulkTimeHolidayEntries);
  yield takeLatest(BULK_INSERT_TIME_HOLIDAY_ENTRIES_SUCCESS, doNotifySuccess);
}

export const bulkInsertTimeHolidayEntriesReducer = (
  state: BulkInsertState,
  action: BulkInsertActions,
): BulkInsertState =>
  produce(state, draft => {
    switch (action.type) {
      case BULK_INSERT_TIME_HOLIDAY_ENTRIES:
        draft.ui.busy.bulkTimeHolidayEntriesInsert = true;
        break;
      case BULK_INSERT_TIME_HOLIDAY_ENTRIES_SUCCESS:
        draft.ui.busy.bulkTimeHolidayEntriesInsert = false;
        break;
      case BULK_INSERT_TIME_HOLIDAY_ENTRIES_FAILURE:
        draft.ui.busy.bulkTimeHolidayEntriesInsert = false;
        break;
    }
  });
