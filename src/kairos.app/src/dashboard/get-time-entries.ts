import { LOCATION_CHANGE } from 'connected-react-router';
import { call, put, takeLatest } from 'redux-saga/effects';
import { action } from 'typesafe-actions';

import { getTimeEntries } from '../services/time-entry/time-entry.service';
import { GET_TIME_ENTRIES, GET_TIME_ENTRIES_ERROR, GET_TIME_ENTRIES_SUCCESS } from './constants';

export const getTimeEntriesAction = () => action(GET_TIME_ENTRIES);
export const getTimeEntriesSuccessAction = () => action(GET_TIME_ENTRIES_SUCCESS);
export const getTimeEntriesErrorAction = (error: string) => action(GET_TIME_ENTRIES_ERROR, error);

function* doGetTimeEntriesOnLocationChange() {
  yield put(getTimeEntriesAction());
}

function* doGetTimeEntries() {
  try {
    yield call(getTimeEntries);

    yield put(getTimeEntriesSuccessAction());
  } catch (error) {
    yield put(getTimeEntriesErrorAction(error.message));
  }
}

export function* getTimeEntriesSaga() {
  yield takeLatest(LOCATION_CHANGE, doGetTimeEntriesOnLocationChange);
  yield takeLatest(GET_TIME_ENTRIES, doGetTimeEntries);
}
