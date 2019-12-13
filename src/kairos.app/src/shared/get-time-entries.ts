import produce from 'immer';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import { createAsyncAction } from 'typesafe-actions';
import { SharedActions } from '../actions';
import { Route } from '../models/route.model';
import { TimeEntryListModel } from '../models/time-entry-list.model';
import { getTimeEntries } from '../services/time-entry/time-entry.service';
import {
  CREATE_TIME_ENTRY_SUCCESS,
  DELETE_TIME_ENTRIES_SUCCESS,
} from '../shared/constants';
import {
  selectDashboardRoute,
  selectTimeEntriesRoute,
} from '../shared/router.selectors';
import {
  GET_TIME_ENTRIES,
  GET_TIME_ENTRIES_FAILURE,
  GET_TIME_ENTRIES_SUCCESS,
} from './constants';
import { selectIsOnline, selectSelectedYear } from './selectors';
import { SharedState } from './state';
import { LOCATION_CHANGE } from 'connected-react-router';
import { getRangeFromYear } from '../code/get-range-from-year';

export const getTimeEntriesAsync = createAsyncAction(
  GET_TIME_ENTRIES,
  GET_TIME_ENTRIES_SUCCESS,
  GET_TIME_ENTRIES_FAILURE,
)<void, TimeEntryListModel[], string>();

function* doGetTimeEntriesOnOtherActions() {
  const timeEntriesRoute: Route = yield select(selectTimeEntriesRoute);
  const dashboardRoute: Route = yield select(selectDashboardRoute);

  if (!!dashboardRoute || !!timeEntriesRoute) {
    yield put(getTimeEntriesAsync.request());
  }
}

function* doGetTimeEntriesOnLocationChange() {
  const timeEntriesRoute: Route = yield select(selectTimeEntriesRoute);

  // don't put dashboard, it already has REFRESH
  if (!!timeEntriesRoute) {
    yield put(getTimeEntriesAsync.request());
  }
}

function* doGetTimeEntries() {
  const isOnline = yield select(selectIsOnline);
  if (!isOnline) {
    yield put(getTimeEntriesAsync.failure(''));
    return;
  }

  try {
    const year = yield select(selectSelectedYear);

    const [start, end] = getRangeFromYear(year);
    const timeEntries = yield call(getTimeEntries, start, end);

    yield put(getTimeEntriesAsync.success(timeEntries));
  } catch (error) {
    yield put(getTimeEntriesAsync.failure(error.message));
  }
}

export function* getTimeEntriesSaga() {
  yield takeLatest(
    [CREATE_TIME_ENTRY_SUCCESS, DELETE_TIME_ENTRIES_SUCCESS],
    doGetTimeEntriesOnOtherActions,
  );

  yield takeLatest([LOCATION_CHANGE], doGetTimeEntriesOnLocationChange);
  yield takeLatest(GET_TIME_ENTRIES, doGetTimeEntries);
}

export const getTimeEntriesReducer = (
  state: SharedState,
  action: SharedActions,
): SharedState =>
  produce(state, draft => {
    switch (action.type) {
      case GET_TIME_ENTRIES:
        draft.ui.busy.getTimeEntries = true;
        break;
      case GET_TIME_ENTRIES_SUCCESS:
        draft.ui.busy.getTimeEntries = false;
        draft.timeEntries = action.payload;
        break;
      case GET_TIME_ENTRIES_FAILURE:
        draft.ui.busy.getTimeEntries = false;
        break;
    }
  });
