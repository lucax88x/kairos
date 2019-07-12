import { LOCATION_CHANGE } from 'connected-react-router';
import { call, put, takeLatest } from 'redux-saga/effects';
import { action } from 'typesafe-actions';

import { getTimeEntries } from '../services/time-entry/time-entry.service';
import { GET_TIME_ENTRIES, GET_TIME_ENTRIES_ERROR, GET_TIME_ENTRIES_SUCCESS } from './constants';
import { TimeEntryModel } from '../models/time-entry.model';
import { DashboardActions } from '../actions';
import { DashboardState } from './state';
import produce from 'immer';

export const getTimeEntriesAction = () => action(GET_TIME_ENTRIES);
export const getTimeEntriesSuccessAction = (timeEntries: TimeEntryModel[]) =>
  action(GET_TIME_ENTRIES_SUCCESS, timeEntries);
export const getTimeEntriesErrorAction = (error: string) => action(GET_TIME_ENTRIES_ERROR, error);

function* doGetTimeEntriesOnLocationChange() {
  yield put(getTimeEntriesAction());
}

function* doGetTimeEntries() {
  try {
    const timeEntries = yield call(getTimeEntries);

    yield put(getTimeEntriesSuccessAction(timeEntries));
  } catch (error) {
    yield put(getTimeEntriesErrorAction(error.message));
  }
}

export function* getTimeEntriesSaga() {
  yield takeLatest(LOCATION_CHANGE, doGetTimeEntriesOnLocationChange);
  yield takeLatest(GET_TIME_ENTRIES, doGetTimeEntries);
}

export const getTimeEntriesReducer = (
  state: DashboardState,
  action: DashboardActions,
): DashboardState =>
  produce(state, draft => {
    switch (action.type) {
      case GET_TIME_ENTRIES:
        draft.timeEntries = [];
        break;
      case GET_TIME_ENTRIES_SUCCESS:
        draft.timeEntries = action.payload;
        break;
    }
  });
