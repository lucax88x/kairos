import produce from 'immer';
import { call, put, takeLatest } from 'redux-saga/effects';
import { createAsyncAction } from 'typesafe-actions';
import { SharedActions } from '../actions';
import { TimeEntryModel } from '../models/time-entry.model';
import { createTimeEntry } from '../services/time-entry/time-entry.service';
import {
  CREATE_TIME_ENTRY,
  CREATE_TIME_ENTRY_FAILURE,
  CREATE_TIME_ENTRY_SUCCESS,
} from './constants';
import { SharedState } from './state';
import { closeTimeEntryDrawerAction } from '../layout/actions';

export const createTimeEntryAsync = createAsyncAction(
  CREATE_TIME_ENTRY,
  CREATE_TIME_ENTRY_SUCCESS,
  CREATE_TIME_ENTRY_FAILURE,
)<TimeEntryModel, void, string>();

function* doCreateTimeEntry({
  payload,
}: ReturnType<typeof createTimeEntryAsync.request>) {
  try {
    yield call(createTimeEntry, payload);

    yield put(createTimeEntryAsync.success());
  } catch (error) {
    yield put(createTimeEntryAsync.failure(error.message));
  }
}

function* doCloseDrawer() {
  yield put(closeTimeEntryDrawerAction());
}

export function* createTimeEntrySaga() {
  yield takeLatest(CREATE_TIME_ENTRY, doCreateTimeEntry);
  yield takeLatest(CREATE_TIME_ENTRY_SUCCESS, doCloseDrawer);
}

export const createTimeEntryReducer = (
  state: SharedState,
  action: SharedActions,
): SharedState =>
  produce(state, draft => {
    switch (action.type) {
      case CREATE_TIME_ENTRY:
        draft.ui.busy.createTimeEntry = true;
        break;
      case CREATE_TIME_ENTRY_SUCCESS:
        draft.ui.busy.createTimeEntry = false;
        break;
      case CREATE_TIME_ENTRY_FAILURE:
        draft.ui.busy.createTimeEntry = false;
        break;
    }
  });
