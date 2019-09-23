import produce from 'immer';
import { call, put, takeLatest } from 'redux-saga/effects';
import { createAsyncAction } from 'typesafe-actions';

import { SharedActions } from '../actions';
import { TimeHolidayEntryModel } from '../models/time-holiday-entry.model';
import { deleteTimeHolidayEntry } from '../services/time-holiday-entry/time-holiday-entry.service';
import {
  DELETE_TIME_HOLIDAY_ENTRY,
  DELETE_TIME_HOLIDAY_ENTRY_FAILURE,
  DELETE_TIME_HOLIDAY_ENTRY_SUCCESS,
} from './constants';
import { SharedState } from './state';
import { enqueueSnackbarAction } from '../notification-manager/actions';

export const deleteTimeHolidayEntryAsync = createAsyncAction(
  DELETE_TIME_HOLIDAY_ENTRY,
  DELETE_TIME_HOLIDAY_ENTRY_SUCCESS,
  DELETE_TIME_HOLIDAY_ENTRY_FAILURE,
)<{ model: TimeHolidayEntryModel }, void, string>();

function* doDeleteTimeHolidayEntry({
  payload: { model },
}: ReturnType<typeof deleteTimeHolidayEntryAsync.request>) {
  try {
    yield call(deleteTimeHolidayEntry, model.id);

    yield put(deleteTimeHolidayEntryAsync.success());
  } catch (error) {
    yield put(deleteTimeHolidayEntryAsync.failure(error.message));
  }
}

function* doNotifySuccess() {
  yield put(enqueueSnackbarAction('Holiday deleted!', { variant: 'success' }));
}

export function* deleteTimeHolidayEntrySaga() {
  yield takeLatest(DELETE_TIME_HOLIDAY_ENTRY, doDeleteTimeHolidayEntry);
  yield takeLatest(DELETE_TIME_HOLIDAY_ENTRY_SUCCESS, doNotifySuccess);
}

export const deleteTimeHolidayEntryReducer = (state: SharedState, action: SharedActions): SharedState =>
  produce(state, draft => {
    switch (action.type) {
      case DELETE_TIME_HOLIDAY_ENTRY:
        draft.ui.busy.deleteTimeHolidayEntry = true;
        break;
      case DELETE_TIME_HOLIDAY_ENTRY_SUCCESS:
        draft.ui.busy.deleteTimeHolidayEntry = false;
        break;
      case DELETE_TIME_HOLIDAY_ENTRY_FAILURE:
        draft.ui.busy.deleteTimeHolidayEntry = false;
        break;
    }
  });
