import produce from 'immer';
import { call, put, takeLatest } from 'redux-saga/effects';
import { createAsyncAction } from 'typesafe-actions';

import { EditTimeEntryActions } from '../actions';
import { TimeEntryModel } from '../models/time-entry.model';
import { updateTimeEntry } from '../services/time-entry/time-entry.service';
import {
  UPDATE_TIME_ENTRY,
  UPDATE_TIME_ENTRY_FAILURE,
  UPDATE_TIME_ENTRY_SUCCESS,
} from './constants';
import { EditTimeEntryState } from './state';
import { enqueueSnackbarAction } from '../notification-manager/actions';

export const updateTimeEntryAsync = createAsyncAction(
  UPDATE_TIME_ENTRY,
  UPDATE_TIME_ENTRY_SUCCESS,
  UPDATE_TIME_ENTRY_FAILURE,
)<{ model: TimeEntryModel }, void, string>();

function* doDeleteTimeEntry({
  payload: { model },
}: ReturnType<typeof updateTimeEntryAsync.request>) {
  try {
    yield call(updateTimeEntry, model);

    yield put(updateTimeEntryAsync.success());
  } catch (error) {
    yield put(updateTimeEntryAsync.failure(error.message));
  }
}

function* doNotifySuccess() {
  yield put(enqueueSnackbarAction('Time Entry updated!', { variant: 'success' }));
}

export function* updateTimeEntrySaga() {
  yield takeLatest(UPDATE_TIME_ENTRY, doDeleteTimeEntry);
  yield takeLatest(UPDATE_TIME_ENTRY_SUCCESS, doNotifySuccess);
}

export const updateTimeEntryReducer = (
  state: EditTimeEntryState,
  action: EditTimeEntryActions,
): EditTimeEntryState =>
  produce(state, draft => {
    switch (action.type) {
      case UPDATE_TIME_ENTRY:
        draft.ui.busy.updateTimeEntry = true;
        break;
      case UPDATE_TIME_ENTRY_SUCCESS:
        draft.ui.busy.updateTimeEntry = false;
        break;
      case UPDATE_TIME_ENTRY_FAILURE:
        draft.ui.busy.updateTimeEntry = false;
        break;
    }
  });
