import produce from 'immer';
import { call, put, takeLatest } from 'redux-saga/effects';
import { createAsyncAction } from 'typesafe-actions';

import { SharedActions } from '../actions';
import { TimeHolidayEntryModel } from '../models/time-holiday-entry.model';
import { createTimeHolidayEntry } from '../services/time-holiday-entry/time-holiday-entry.service';
import {
  CREATE_TIME_HOLIDAY_ENTRY,
  CREATE_TIME_HOLIDAY_ENTRY_FAILURE,
  CREATE_TIME_HOLIDAY_ENTRY_SUCCESS,
} from './constants';
import { SharedState } from './state';

export const createTimeHolidayEntryAsync = createAsyncAction(
  CREATE_TIME_HOLIDAY_ENTRY,
  CREATE_TIME_HOLIDAY_ENTRY_SUCCESS,
  CREATE_TIME_HOLIDAY_ENTRY_FAILURE,
)<TimeHolidayEntryModel, void, string>();

function* doCreateTimeHolidayEntry({ payload }: ReturnType<typeof createTimeHolidayEntryAsync.request>) {
  try {
    yield call(createTimeHolidayEntry, payload);

    yield put(createTimeHolidayEntryAsync.success());
  } catch (error) {
    yield put(createTimeHolidayEntryAsync.failure(error.message));
  }
}

export function* createTimeHolidayEntrySaga() {
  yield takeLatest(CREATE_TIME_HOLIDAY_ENTRY, doCreateTimeHolidayEntry);
}

export const createTimeHolidayEntryReducer = (state: SharedState, action: SharedActions): SharedState =>
  produce(state, draft => {
    switch (action.type) {
      case CREATE_TIME_HOLIDAY_ENTRY:
        draft.ui.busy.createTimeHolidayEntry = true;
        break;
      case CREATE_TIME_HOLIDAY_ENTRY_SUCCESS:
        draft.ui.busy.createTimeHolidayEntry = false;
        break;
      case CREATE_TIME_HOLIDAY_ENTRY_FAILURE:
        draft.ui.busy.createTimeHolidayEntry = false;
        break;
    }
  });
