import produce from 'immer';
import { call, put, takeLatest } from 'redux-saga/effects';
import { createAsyncAction } from 'typesafe-actions';
import { SharedActions } from '../actions';
import { UUID } from '../models/uuid.model';
import { deleteTimeEntry } from '../services/time-entry/time-entry.service';
import { DELETE_TIME_ENTRY, DELETE_TIME_ENTRY_FAILURE, DELETE_TIME_ENTRY_SUCCESS } from './constants';
import { SharedState } from './state';


export const deleteTimeEntryAsync = createAsyncAction(
  DELETE_TIME_ENTRY,
  DELETE_TIME_ENTRY_SUCCESS,
  DELETE_TIME_ENTRY_FAILURE,
)<{ id: UUID }, void, string>();

function* doDeleteTimeEntry({ payload: { id } }: ReturnType<typeof deleteTimeEntryAsync.request>) {
  try {
    yield call(deleteTimeEntry, id);

    yield put(deleteTimeEntryAsync.success());
  } catch (error) {
    yield put(deleteTimeEntryAsync.failure(error.message));
  }
}

export function* deleteTimeEntrySaga() {
  yield takeLatest(DELETE_TIME_ENTRY, doDeleteTimeEntry);
}

export const deleteTimeEntryReducer = (state: SharedState, action: SharedActions): SharedState =>
  produce(state, draft => {
    switch (action.type) {
      case DELETE_TIME_ENTRY:
        draft.ui.busy.deleteTimeEntry = true;
        break;
      case DELETE_TIME_ENTRY_SUCCESS:
        draft.ui.busy.deleteTimeEntry = false;
        break;
      case DELETE_TIME_ENTRY_FAILURE:
        draft.ui.busy.deleteTimeEntry = false;
        break;
    }
  });
