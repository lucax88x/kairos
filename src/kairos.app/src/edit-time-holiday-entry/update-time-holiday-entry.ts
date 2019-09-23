import produce from 'immer';
import { call, put, takeLatest } from 'redux-saga/effects';
import { createAsyncAction } from 'typesafe-actions';

import { EditTimeHolidayEntryActions } from '../actions';
import { TimeHolidayEntryModel } from '../models/time-holiday-entry.model';
import { updateTimeHolidayEntry } from '../services/time-holiday-entry/time-holiday-entry.service';
import {
  UPDATE_TIME_HOLIDAY_ENTRY,
  UPDATE_TIME_HOLIDAY_ENTRY_FAILURE,
  UPDATE_TIME_HOLIDAY_ENTRY_SUCCESS,
} from './constants';
import { EditTimeHolidayEntryState } from './state';
import { enqueueSnackbarAction } from '../notification-manager/enqueue-snackbar';

export const updateTimeHolidayEntryAsync = createAsyncAction(
  UPDATE_TIME_HOLIDAY_ENTRY,
  UPDATE_TIME_HOLIDAY_ENTRY_SUCCESS,
  UPDATE_TIME_HOLIDAY_ENTRY_FAILURE,
)<{ model: TimeHolidayEntryModel }, void, string>();

function* doDeleteTimeHolidayEntry({
  payload: { model },
}: ReturnType<typeof updateTimeHolidayEntryAsync.request>) {
  try {
    yield call(updateTimeHolidayEntry, model);

    yield put(updateTimeHolidayEntryAsync.success());
  } catch (error) {
    yield put(updateTimeHolidayEntryAsync.failure(error.message));
  }
}

function* doNotifySuccess() {
  yield put(enqueueSnackbarAction('Holiday updated!', { variant: 'success' }));
}

export function* updateTimeHolidayEntrySaga() {
  yield takeLatest(UPDATE_TIME_HOLIDAY_ENTRY, doDeleteTimeHolidayEntry);
  yield takeLatest(UPDATE_TIME_HOLIDAY_ENTRY_SUCCESS, doNotifySuccess);
}

export const updateTimeHolidayEntryReducer = (
  state: EditTimeHolidayEntryState,
  action: EditTimeHolidayEntryActions,
): EditTimeHolidayEntryState =>
  produce(state, draft => {
    switch (action.type) {
      case UPDATE_TIME_HOLIDAY_ENTRY:
        draft.ui.busy.updateTimeHolidayEntry = true;
        break;
      case UPDATE_TIME_HOLIDAY_ENTRY_SUCCESS:
        draft.ui.busy.updateTimeHolidayEntry = false;
        break;
      case UPDATE_TIME_HOLIDAY_ENTRY_FAILURE:
        draft.ui.busy.updateTimeHolidayEntry = false;
        break;
    }
  });