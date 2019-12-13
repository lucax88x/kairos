import produce from 'immer';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import { createAsyncAction } from 'typesafe-actions';
import { SharedActions } from '../actions';
import { Route } from '../models/route.model';
import { TimeHolidayEntryModel } from '../models/time-holiday-entry.model';
import { getTimeHolidayEntries } from '../services/time-holiday-entry/time-holiday-entry.service';
import {
  CREATE_TIME_HOLIDAY_ENTRY_SUCCESS,
  DELETE_TIME_HOLIDAY_ENTRIES_SUCCESS,
  UPDATE_TIME_HOLIDAY_ENTRIES_BY_COUNTRY_SUCCESS,
} from '../shared/constants';
import {
  selectDashboardRoute,
  selectTimeHolidayEntriesRoute,
} from '../shared/router.selectors';
import {
  GET_TIME_HOLIDAY_ENTRIES,
  GET_TIME_HOLIDAY_ENTRIES_FAILURE,
  GET_TIME_HOLIDAY_ENTRIES_SUCCESS,
} from './constants';
import { selectIsOnline, selectSelectedYear } from './selectors';
import { SharedState } from './state';
import { getRangeFromYear } from '../code/get-range-from-year';
import { LOCATION_CHANGE } from 'connected-react-router';

export const getTimeHolidayEntriesAsync = createAsyncAction(
  GET_TIME_HOLIDAY_ENTRIES,
  GET_TIME_HOLIDAY_ENTRIES_SUCCESS,
  GET_TIME_HOLIDAY_ENTRIES_FAILURE,
)<void, TimeHolidayEntryModel[], string>();

function* doGetTimeHolidayEntriesOnOtherActions() {
  const timeHolidayEntriesRoute: Route = yield select(
    selectTimeHolidayEntriesRoute,
  );
  const dashboardRoute: Route = yield select(selectDashboardRoute);

  if (!!dashboardRoute || !!timeHolidayEntriesRoute) {
    yield put(getTimeHolidayEntriesAsync.request());
  }
}

function* doGetTimeHolidayEntriesOnLocationChange() {
  const timeHolidayEntriesRoute: Route = yield select(
    selectTimeHolidayEntriesRoute,
  );

  // don't put dashboard, it already has REFRESH
  if (!!timeHolidayEntriesRoute) {
    yield put(getTimeHolidayEntriesAsync.request());
  }
}

function* doGetTimeHolidayEntries() {
  const isOnline = yield select(selectIsOnline);
  if (!isOnline) {
    yield put(getTimeHolidayEntriesAsync.failure(''));
    return;
  }

  try {
    const year = yield select(selectSelectedYear);
    const [start, end] = getRangeFromYear(year);
    const timeHolidayEntries = yield call(getTimeHolidayEntries, start, end);

    yield put(getTimeHolidayEntriesAsync.success(timeHolidayEntries));
  } catch (error) {
    yield put(getTimeHolidayEntriesAsync.failure(error.message));
  }
}

export function* getTimeHolidayEntriesSaga() {
  yield takeLatest(
    [
      CREATE_TIME_HOLIDAY_ENTRY_SUCCESS,
      DELETE_TIME_HOLIDAY_ENTRIES_SUCCESS,
      UPDATE_TIME_HOLIDAY_ENTRIES_BY_COUNTRY_SUCCESS,
    ],
    doGetTimeHolidayEntriesOnOtherActions,
  );
  yield takeLatest([LOCATION_CHANGE], doGetTimeHolidayEntriesOnLocationChange);
  yield takeLatest(GET_TIME_HOLIDAY_ENTRIES, doGetTimeHolidayEntries);
}

export const getTimeHolidayEntriesReducer = (
  state: SharedState,
  action: SharedActions,
): SharedState =>
  produce(state, draft => {
    switch (action.type) {
      case GET_TIME_HOLIDAY_ENTRIES:
        draft.ui.busy.getTimeHolidayEntries = true;
        break;
      case GET_TIME_HOLIDAY_ENTRIES_SUCCESS:
        draft.ui.busy.getTimeHolidayEntries = false;
        draft.timeHolidayEntries = action.payload;
        break;
      case GET_TIME_HOLIDAY_ENTRIES_FAILURE:
        draft.ui.busy.getTimeHolidayEntries = false;
        break;
    }
  });
