import { LOCATION_CHANGE } from 'connected-react-router';
import produce from 'immer';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import { createAsyncAction } from 'typesafe-actions';

import { DashboardActions } from '../actions';
import { Route } from '../models/route.model';
import { TimeEntryModel } from '../models/time-entry.model';
import { getTimeEntries } from '../services/time-entry/time-entry.service';
import { CREATE_TIME_ENTRY_SUCCESS, DELETE_TIME_ENTRY_SUCCESS } from '../shared/constants';
import { selectDashboardRoute } from '../shared/router.selectors';
import { GET_TIME_ENTRIES, GET_TIME_ENTRIES_FAILURE, GET_TIME_ENTRIES_SUCCESS } from './constants';
import { DashboardState } from './state';

export const getTimeEntriesAsync = createAsyncAction(
  GET_TIME_ENTRIES,
  GET_TIME_ENTRIES_SUCCESS,
  GET_TIME_ENTRIES_FAILURE,
)<void, TimeEntryModel[], string>();

function* doGetTimeEntriesOnOtherActions() {
  const route: Route = yield select(selectDashboardRoute);

  if (!!route) {
    yield put(getTimeEntriesAsync.request());
  }
}

function* doGetTimeEntries() {
  try {
    const timeEntries = yield call(getTimeEntries);

    yield put(getTimeEntriesAsync.success(timeEntries));
  } catch (error) {
    yield put(getTimeEntriesAsync.failure(error.message));
  }
}

export function* getTimeEntriesSaga() {
  yield takeLatest(
    [LOCATION_CHANGE, CREATE_TIME_ENTRY_SUCCESS, DELETE_TIME_ENTRY_SUCCESS],
    doGetTimeEntriesOnOtherActions,
  );
  yield takeLatest(GET_TIME_ENTRIES, doGetTimeEntries);
}

export const getTimeEntriesReducer = (
  state: DashboardState,
  action: DashboardActions,
): DashboardState =>
  produce(state, draft => {
    switch (action.type) {
      case GET_TIME_ENTRIES:
        draft.ui.busy.getTimeEntries = true;
        draft.timeEntries = [];
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
