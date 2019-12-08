import produce from 'immer';
import { call, put, takeLatest } from 'redux-saga/effects';
import { createAsyncAction } from 'typesafe-actions';
import { SharedActions } from '../actions';
import { TimeAbsenceEntryModel } from '../models/time-absence-entry.model';
import { createTimeAbsenceEntry } from '../services/time-absence-entry/time-absence-entry.service';
import {
  CREATE_TIME_ABSENCE_ENTRY,
  CREATE_TIME_ABSENCE_ENTRY_FAILURE,
  CREATE_TIME_ABSENCE_ENTRY_SUCCESS,
} from './constants';
import { SharedState } from './state';
import { closeTimeAbsenceEntryDrawerAction } from '../layout/actions';

export const createTimeAbsenceEntryAsync = createAsyncAction(
  CREATE_TIME_ABSENCE_ENTRY,
  CREATE_TIME_ABSENCE_ENTRY_SUCCESS,
  CREATE_TIME_ABSENCE_ENTRY_FAILURE,
)<TimeAbsenceEntryModel, void, string>();

function* doCreateTimeAbsenceEntry({
  payload,
}: ReturnType<typeof createTimeAbsenceEntryAsync.request>) {
  try {
    yield call(createTimeAbsenceEntry, payload);

    yield put(createTimeAbsenceEntryAsync.success());
  } catch (error) {
    yield put(createTimeAbsenceEntryAsync.failure(error.message));
  }
}

function* doCloseDrawer() {
  yield put(closeTimeAbsenceEntryDrawerAction());
}

export function* createTimeAbsenceEntrySaga() {
  yield takeLatest(CREATE_TIME_ABSENCE_ENTRY, doCreateTimeAbsenceEntry);
  yield takeLatest(CREATE_TIME_ABSENCE_ENTRY_SUCCESS, doCloseDrawer);
}

export const createTimeAbsenceEntryReducer = (
  state: SharedState,
  action: SharedActions,
): SharedState =>
  produce(state, draft => {
    switch (action.type) {
      case CREATE_TIME_ABSENCE_ENTRY:
        draft.ui.busy.createTimeAbsenceEntry = true;
        break;
      case CREATE_TIME_ABSENCE_ENTRY_SUCCESS:
        draft.ui.busy.createTimeAbsenceEntry = false;
        break;
      case CREATE_TIME_ABSENCE_ENTRY_FAILURE:
        draft.ui.busy.createTimeAbsenceEntry = false;
        break;
    }
  });
