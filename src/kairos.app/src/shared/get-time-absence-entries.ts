import { LOCATION_CHANGE } from 'connected-react-router';
import produce from 'immer';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import { createAsyncAction } from 'typesafe-actions';
import { SharedActions } from '../actions';
import { Route } from '../models/route.model';
import { TimeAbsenceEntryModel } from '../models/time-absence-entry.model';
import { getTimeAbsenceEntries } from '../services/time-absence-entry/time-absence-entry.service';
import {
  CREATE_TIME_ABSENCE_ENTRY_SUCCESS,
  DELETE_TIME_ABSENCE_ENTRIES_SUCCESS,
  SELECT_YEAR,
} from '../shared/constants';
import { selectTimeAbsenceEntriesRoute, selectDashboardRoute } from '../shared/router.selectors';
import {
  GET_TIME_ABSENCE_ENTRIES,
  GET_TIME_ABSENCE_ENTRIES_FAILURE,
  GET_TIME_ABSENCE_ENTRIES_SUCCESS,
} from './constants';
import { selectIsOnline, selectSelectedYear } from './selectors';
import { SharedState } from './state';

export const getTimeAbsenceEntriesAsync = createAsyncAction(
  GET_TIME_ABSENCE_ENTRIES,
  GET_TIME_ABSENCE_ENTRIES_SUCCESS,
  GET_TIME_ABSENCE_ENTRIES_FAILURE,
)<void, TimeAbsenceEntryModel[], string>();

function* doGetTimeAbsenceEntriesOnOtherActions() {
  const timeAbsenceEntriesRoute: Route = yield select(
    selectTimeAbsenceEntriesRoute,
  );
  const dashboardRoute: Route = yield select(selectDashboardRoute);

  if (!!dashboardRoute || !!timeAbsenceEntriesRoute) {
    yield put(getTimeAbsenceEntriesAsync.request());
  }
}

function* doGetTimeAbsenceEntries() {
  const isOnline = yield select(selectIsOnline);
  if (!isOnline) {
    yield put(getTimeAbsenceEntriesAsync.failure(''));
    return;
  }

  try {
    const year = yield select(selectSelectedYear);

    const timeAbsenceEntries = yield call(getTimeAbsenceEntries, year);

    yield put(getTimeAbsenceEntriesAsync.success(timeAbsenceEntries));
  } catch (error) {
    yield put(getTimeAbsenceEntriesAsync.failure(error.message));
  }
}

export function* getTimeAbsenceEntriesSaga() {
  yield takeLatest(
    [
      LOCATION_CHANGE,
      CREATE_TIME_ABSENCE_ENTRY_SUCCESS,
      DELETE_TIME_ABSENCE_ENTRIES_SUCCESS,
    ],
    doGetTimeAbsenceEntriesOnOtherActions,
  );
  yield takeLatest(GET_TIME_ABSENCE_ENTRIES, doGetTimeAbsenceEntries);
}

export const getTimeAbsenceEntriesReducer = (
  state: SharedState,
  action: SharedActions,
): SharedState =>
  produce(state, draft => {
    switch (action.type) {
      case GET_TIME_ABSENCE_ENTRIES:
        draft.ui.busy.getTimeAbsenceEntries = true;
        draft.timeAbsenceEntries = [];
        break;
      case GET_TIME_ABSENCE_ENTRIES_SUCCESS:
        draft.ui.busy.getTimeAbsenceEntries = false;
        draft.timeAbsenceEntries = action.payload;
        break;
      case GET_TIME_ABSENCE_ENTRIES_FAILURE:
        draft.ui.busy.getTimeAbsenceEntries = false;
        break;
    }
  });
