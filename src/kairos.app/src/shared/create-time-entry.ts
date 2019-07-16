import produce from 'immer';
import { call, put, takeLatest } from 'redux-saga/effects';
import { createAsyncAction } from 'typesafe-actions';

import { SharedActions } from '../actions';
import { closeRightDrawerAction } from '../layout/actions';
import { TimeEntryTypes } from '../models/time-entry.model';
import { UUID } from '../models/uuid.model';
import { createTimeEntry } from '../services/time-entry/time-entry.service';
import {
  CREATE_TIME_ENTRY,
  CREATE_TIME_ENTRY_FAILURE,
  CREATE_TIME_ENTRY_SUCCESS,
} from './constants';
import { SharedState } from './state';

export const createTimeEntryAsync = createAsyncAction(
  CREATE_TIME_ENTRY,
  CREATE_TIME_ENTRY_SUCCESS,
  CREATE_TIME_ENTRY_FAILURE,
)<{ type: TimeEntryTypes; when: Date }, void, string>();

function* doCreateTimeEntry({
  payload: { type, when },
}: ReturnType<typeof createTimeEntryAsync.request>) {
  try {
    yield call(createTimeEntry, {
      id: UUID.Generate(),
      type: type,
      when: when,
    });

    yield put(createTimeEntryAsync.success());
  } catch (error) {
    yield put(createTimeEntryAsync.failure(error.message));
  }
}

function* doCloseDrawer() {
  yield put(closeRightDrawerAction());
}

export function* createTimeEntrySaga() {
  yield takeLatest(CREATE_TIME_ENTRY, doCreateTimeEntry);
  yield takeLatest(CREATE_TIME_ENTRY_SUCCESS, doCloseDrawer);
}

export const createTimeEntryReducer = (state: SharedState, action: SharedActions): SharedState =>
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
