import { LOCATION_CHANGE } from 'connected-react-router';
import produce from 'immer';
import { call, put, select, takeLatest } from 'redux-saga/effects';
import { createAsyncAction } from 'typesafe-actions';
import { SharedActions } from '../actions';
import { Route } from '../models/route.model';
import { TimeHolidayEntryModel } from '../models/time-holiday-entry.model';
import { getTimeHolidayEntries } from '../services/time-holiday-entry/time-holiday-entry.service';
import {
  CREATE_TIME_HOLIDAY_ENTRY_SUCCESS,
  DELETE_TIME_HOLIDAY_ENTRY_SUCCESS,
  SELECT_YEAR,
  UPDATE_TIME_HOLIDAY_ENTRIES_BY_COUNTRY_SUCCESS,
} from '../shared/constants';
import { selectDashboardRoute, selectTimeHolidayEntriesRoute } from '../shared/router.selectors';
import {
  GET_TIME_HOLIDAY_ENTRIES,
  GET_TIME_HOLIDAY_ENTRIES_FAILURE,
  GET_TIME_HOLIDAY_ENTRIES_SUCCESS,
} from './constants';
import { selectSelectedYear } from './selectors';
import { SharedState } from './state';

export const getTimeHolidayEntriesAsync = createAsyncAction(
  GET_TIME_HOLIDAY_ENTRIES,
  GET_TIME_HOLIDAY_ENTRIES_SUCCESS,
  GET_TIME_HOLIDAY_ENTRIES_FAILURE,
)<void, TimeHolidayEntryModel[], string>();

function* doGetTimeHolidayEntriesOnOtherActions() {
  const dashboardRoute: Route = yield select(selectDashboardRoute);
  const timeHolidayEntriesRoute: Route = yield select(selectTimeHolidayEntriesRoute);

  if (!!dashboardRoute || !!timeHolidayEntriesRoute) {
    yield put(getTimeHolidayEntriesAsync.request());
  }
}

function* doGetTimeHolidayEntries() {
  try {
    const year = yield select(selectSelectedYear);
    const timeHolidayEntries = yield call(getTimeHolidayEntries, year);

    yield put(getTimeHolidayEntriesAsync.success(timeHolidayEntries));
  } catch (error) {
    yield put(getTimeHolidayEntriesAsync.failure(error.message));
  }
}

export function* getTimeHolidayEntriesSaga() {
  yield takeLatest(
    [
      LOCATION_CHANGE,
      CREATE_TIME_HOLIDAY_ENTRY_SUCCESS,
      DELETE_TIME_HOLIDAY_ENTRY_SUCCESS,
      UPDATE_TIME_HOLIDAY_ENTRIES_BY_COUNTRY_SUCCESS,
      SELECT_YEAR,
    ],
    doGetTimeHolidayEntriesOnOtherActions,
  );
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
        draft.timeHolidayEntries = [];
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
