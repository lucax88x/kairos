import produce from 'immer';
import { call, put, takeLatest, select } from 'redux-saga/effects';
import { createAsyncAction } from 'typesafe-actions';

import { SharedActions } from '../actions';
import { updateTimeHolidayEntriesByCountry } from '../services/time-holiday-entry/time-holiday-entry.service';
import {
  UPDATE_TIME_HOLIDAY_ENTRIES_BY_COUNTRY,
  UPDATE_TIME_HOLIDAY_ENTRIES_BY_COUNTRY_FAILURE,
  UPDATE_TIME_HOLIDAY_ENTRIES_BY_COUNTRY_SUCCESS,
} from './constants';
import { SharedState } from './state';
import { selectSelectedYear } from './selectors';

export const updateTimeHolidayEntriesByCountryAsync = createAsyncAction(
  UPDATE_TIME_HOLIDAY_ENTRIES_BY_COUNTRY,
  UPDATE_TIME_HOLIDAY_ENTRIES_BY_COUNTRY_SUCCESS,
  UPDATE_TIME_HOLIDAY_ENTRIES_BY_COUNTRY_FAILURE,
)<{ countryCode: string }, void, string>();

function* doUpdateTimeHolidayEntriesByCountry({
  payload: { countryCode },
}: ReturnType<typeof updateTimeHolidayEntriesByCountryAsync.request>) {
  try {
    const year = yield select(selectSelectedYear);

    yield call(updateTimeHolidayEntriesByCountry, year, countryCode);

    yield put(updateTimeHolidayEntriesByCountryAsync.success());
  } catch (error) {
    yield put(updateTimeHolidayEntriesByCountryAsync.failure(error.message));
  }
}

export function* updateTimeHolidayEntriesByCountrySaga() {
  yield takeLatest(UPDATE_TIME_HOLIDAY_ENTRIES_BY_COUNTRY, doUpdateTimeHolidayEntriesByCountry);
}

export const updateTimeHolidayEntriesByCountryReducer = (
  state: SharedState,
  action: SharedActions,
): SharedState =>
  produce(state, draft => {
    switch (action.type) {
      case UPDATE_TIME_HOLIDAY_ENTRIES_BY_COUNTRY:
        draft.ui.busy.updateTimeHolidayEntriesByCountry = true;
        break;
      case UPDATE_TIME_HOLIDAY_ENTRIES_BY_COUNTRY_SUCCESS:
        draft.ui.busy.updateTimeHolidayEntriesByCountry = false;
        break;
      case UPDATE_TIME_HOLIDAY_ENTRIES_BY_COUNTRY_FAILURE:
        draft.ui.busy.updateTimeHolidayEntriesByCountry = false;
        break;
    }
  });
